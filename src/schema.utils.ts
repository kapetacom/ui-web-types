import {
    SchemaDTO,
    SchemaEntity,
    SchemaEntityType,
    SchemaEntryType,
    SchemaEnum,
    SchemaProperties
} from "./schemas";

import _ from "lodash";

export function isDTO(entity:SchemaEntity): entity is SchemaDTO {
    //Defaults to DTO
    return !entity.type || entity.type === SchemaEntityType.DTO;
}

export function isEnum(entity:SchemaEntity): entity is SchemaEnum {
    return entity.type === SchemaEntityType.ENUM;
}

export function toEnum(entity:SchemaEntity):SchemaEnum {
    if (!isEnum(entity)) {
        throw new Error('Entity was not enum');
    }
    return entity;
}

export function toDTO(entity:SchemaEntity):SchemaDTO {
    if (!isDTO(entity)) {
        throw new Error('Entity was not DTO');
    }
    return entity;
}

export function toStringName(type?:SchemaEntryType):string {
    if (!type) {
        return 'void';
    }

    if (typeof type !== 'string' && type.$ref) {
        type = type.$ref;
    }
    if (typeof type !== 'string') {
        throw new Error('Invalid type:' + type);
    }

    return type;
}

export function isList(type?:SchemaEntryType) {
    return toStringName(type).endsWith('[]')
}

/**
 * Reformats value to a valid entity name
 * @param type
 */
export function typeName(type?:SchemaEntryType) {
    type = toStringName(type)

    if (type.endsWith('[]')) {
        //Handle lists
        return type.substring(0, type.length - 2);
    }

    return type;
}

export function typeValue(type?:SchemaEntryType) {
    if (!type) {
        return 'void';
    }

    if (typeof type === 'string') {
        return type;
    }

    return '$ref:' + type.$ref;
}

export function isBuiltInType(type?:SchemaEntryType) {
    if (!type) {
        return true;
    }

    return typeof type === 'string';
}


export function isStringableType(type:SchemaEntryType) {
    if (typeof type !== 'string') {
        return false;
    }

    return ['string','number','float','integer','decimal','double'].indexOf(type) > -1;
}
export function getCompatibilityIssuesForTypes(a: SchemaEntryType|undefined, b: SchemaEntryType|undefined, aEntities:SchemaEntity[], bEntities:SchemaEntity[]):string[] {
    if (!a && !b) {
        return [];
    }

    if (!a) {
        a = 'void';
    }

    if (!b) {
        b = 'void';
    }

    if (isList(a) !== isList(b)) {
        return [`Types are not both lists`];
    }

    const aTypeName = typeName(a);
    const bTypeName = typeName(b);

    if (isBuiltInType(a) !== isBuiltInType(b)) {
        return [`Types are not compatible`];
    }

    if (isStringableType(aTypeName) &&
        isStringableType(bTypeName)) {
        return [];
    }

    if (isBuiltInType(a)) {
        if (aTypeName === bTypeName) {
            return [];
        }
        return [`Types are not compatible`];
    }

    let aEntity:SchemaEntity|undefined = _.find(aEntities, {name:aTypeName});
    let bEntity:SchemaEntity|undefined = _.find(bEntities, {name:bTypeName});

    if (!aEntity && !bEntity) {
        return [`Both entities were not defined`];
    }

    if (!aEntity) {
        return [`${aTypeName} was not defined`];
    }

    if (!aEntity) {
        return [`${bTypeName} was not defined`];
    }

    return getSchemaEntityCompatibilityIssues(aEntity, bEntity, aEntities, bEntities);
}

export function isCompatibleTypes(a: SchemaEntryType|undefined, b: SchemaEntryType|undefined, aEntities:SchemaEntity[], bEntities:SchemaEntity[]) {
    return getCompatibilityIssuesForTypes(a,b,aEntities, bEntities).length === 0;
}

export function getSchemaEntityCompatibilityIssues(a:SchemaEntity, b:SchemaEntity, aEntities:SchemaEntity[], bEntities:SchemaEntity[]):string[] {
    if (isDTO(a) !== isDTO(b)) {
        return [`Enum and DTO are not compatible`];
    }

    if (isDTO(a) && isDTO(b)) {
        return getSchemaPropertiesCompatibilityIssues(a.properties, b.properties, aEntities, bEntities);
    }

    if (isEnum(a) && isEnum(b)) {
        return getSchemaEnumValuesCompatibilityIssues(a.values, b.values)
    }

    return [
        `Unknown entity types provided`
    ];
}

export function isSchemaEntityCompatible(a:SchemaEntity, b:SchemaEntity, aEntities:SchemaEntity[], bEntities:SchemaEntity[]) {
    return getSchemaEntityCompatibilityIssues(a,b,aEntities, bEntities).length === 0;
}

export function getSchemaEnumValuesCompatibilityIssues(a:string[], b:string[]):string[] {
    if (a.length != b.length) {
        return ['Mismatch in number of enum values'];
    }

    for(let i = 0; i < a.length; i++) {
        if (!b.some(bVal => bVal === a[i])) {
            return [`Missing enum value: ${a[i]}`];
        }
    }

    for(let i = 0; i < b.length; i++) {
        if (!a.some(aVal => aVal === b[i])) {
            return [`Missing enum value: ${b[i]}`];
        }
    }

    return [];
}

export function isSchemaEnumValuesCompatible(a:string[], b:string[]) {
    return getSchemaEnumValuesCompatibilityIssues(a,b).length === 0;
}

export function getSchemaPropertiesCompatibilityIssues(a:SchemaProperties, b:SchemaProperties, aEntities:SchemaEntity[], bEntities:SchemaEntity[]):string[] {
    const aProperties = Object.values(a);
    const bProperties = Object.values(b);

    if (aProperties.length !== bProperties.length) {
        return [
            `Property counts did not match`
        ];
    }

    const aEntries = Object.entries(a);
    for(let i = 0; i < aEntries.length; i++) {
        const [id, aProperty] = aEntries[i];

        const bProperty = b[id];
        if (!bProperty) {
            return [`Property not found: ${id}`];
        }

        const issues = getCompatibilityIssuesForTypes(aProperty.type, bProperty.type, aEntities, bEntities)

        if (issues.length > 0) {
            return issues.map(error => `${error} for property: ${id}`);
        }
    }

    return [];
}

export function isSchemaPropertiesCompatible(a:SchemaProperties, b:SchemaProperties, aEntities:SchemaEntity[], bEntities:SchemaEntity[]) {
    return getSchemaPropertiesCompatibilityIssues(a, b, aEntities, bEntities).length === 0;
}

export function hasEntityReference(object:any, entityName:string) {
    if (!object) {
        return false;
    }

    if (!_.isObject(object) && !_.isArray(object)) {
        return false;
    }

    const values = _.isArray(object) ? object : Object.values(object);

    for(let i = 0 ; i < values.length; i++) {
        const value = values[i];
        if (value && value.$ref === entityName) {
            return true;
        }

        if (_.isObject(value) || _.isArray(value)) {
            if (hasEntityReference(value, entityName)) {
                return true;
            }
        }
    }

    return false;
}