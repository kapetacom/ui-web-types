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

export function isCompatibleTypes(a: SchemaEntryType|undefined, b: SchemaEntryType|undefined, aEntities:SchemaEntity[], bEntities:SchemaEntity[]) {
    if (!a && !b) {
        return true;
    }

    if (!a) {
        a = 'void';
    }

    if (!b) {
        b = 'void';
    }

    if (isList(a) !== isList(b)) {
        return false;
    }

    const aTypeName = typeName(a);
    const bTypeName = typeName(b);

    if (isBuiltInType(a) !== isBuiltInType(b)) {
        return false;
    }

    if (isStringableType(aTypeName) &&
        isStringableType(bTypeName)) {
        return true;
    }

    if (isBuiltInType(a)) {
        return aTypeName === bTypeName;
    }

    let aEntity:SchemaEntity|undefined = _.find(aEntities, {name:aTypeName});
    let bEntity:SchemaEntity|undefined = _.find(bEntities, {name:bTypeName});

    if (!aEntity || !bEntity) {
        return false;
    }

    return isSchemaEntityCompatible(aEntity, bEntity, aEntities, bEntities);
}

export function isSchemaEntityCompatible(a:SchemaEntity, b:SchemaEntity, aEntities:SchemaEntity[], bEntities:SchemaEntity[]) {
    if (isDTO(a) !== isDTO(b)) {
        return false;
    }

    if (isDTO(a) && isDTO(b)) {
        return isSchemaPropertiesCompatible(a.properties, b.properties, aEntities, bEntities);
    }

    if (isEnum(a) && isEnum(b)) {
        return isSchemaEnumValuesCompatible(a.values, b.values)
    }

    return false;
}

export function isSchemaEnumValuesCompatible(a:string[], b:string[]) {
    if (a.length != b.length) {
        return false;
    }
    return a.filter(aVal => {
        return !b.some(bVal => bVal === aVal)
    }).length === 0;
}

export function isSchemaPropertiesCompatible(a:SchemaProperties, b:SchemaProperties, aEntities:SchemaEntity[], bEntities:SchemaEntity[]) {
    const aProperties = Object.values(a);
    const bProperties = Object.values(b);

    if (aProperties.length !== bProperties.length) {
        return false;
    }

    const aEntries = Object.entries(a);
    for(let i = 0; i < aEntries.length; i++) {
        const [id, aProperty] = aEntries[i];

        const bProperty = b[id];
        if (!bProperty) {
            return false;
        }

        if (!isCompatibleTypes(aProperty.type, bProperty.type, aEntities, bEntities)) {
            return false;
        }
    }

    return true;
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