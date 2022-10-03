import {
    SchemaDTO,
    SchemaEntity,
    SchemaEntityType,
    SchemaEntry,
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


/**
 * Reformats value to a valid entity name
 * @param type
 */
export function typeName(type?:SchemaEntryType) {
    if (!type) {
        return 'void';
    }

    if (typeof type === 'string') {
        return type;
    }

    if (type.$ref && type.$ref.endsWith('[]')) {
        //Handle lists
        return type.$ref.substr(0, type.$ref.length - 2);
    }

    return type.$ref;
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

export function isCompatibleTypes(a: SchemaEntryType|undefined, b: SchemaEntryType|undefined, aEntities:SchemaDTO[], bEntities:SchemaDTO[]) {
    if (!a && !b) {
        return true;
    }

    if (!a || !b) {
        return false;
    }

    if (isStringableType(a) &&
        isStringableType(b)) {
        return true;
    }

    if (isBuiltInType(a) !== isBuiltInType(b)) {
        return false;
    }

    if (isBuiltInType(a)) {
        return typeName(a) === typeName(b);
    }

    const aEntityName = typeName(a);
    const bEntityName = typeName(b);

    let aEntity:SchemaDTO|undefined = _.find(aEntities, {name:aEntityName});
    let bEntity:SchemaDTO|undefined = _.find(bEntities, {name:bEntityName});

    if (!aEntity || !bEntity) {
        return false;
    }

    return isSchemaEntityCompatible(aEntity, bEntity, aEntities, bEntities);
}

export function isSchemaEntityCompatible(a:SchemaDTO, b:SchemaDTO, aEntities:SchemaDTO[], bEntities:SchemaDTO[]) {
    return isSchemaPropertiesCompatible(a.properties, b.properties, aEntities, bEntities);
}

export function isSchemaPropertiesCompatible(a:SchemaProperties, b:SchemaProperties, aEntities:SchemaDTO[], bEntities:SchemaDTO[]) {
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

export function isSchemaEntriesCompatible(aProperties:SchemaEntry[], bProperties:SchemaEntry[], aEntities:SchemaDTO[], bEntities:SchemaDTO[]) {
    if (aProperties.length !== bProperties.length) {
        return false;
    }

    return isSchemaEntryTypesCompatible(
        aProperties.map(p => p.type),
        bProperties.map(p => p.type),
        aEntities,
        bEntities
    );
}

export function isSchemaEntryTypesCompatible(aTypes:SchemaEntryType[], bTypes:SchemaEntryType[], aEntities:SchemaDTO[], bEntities:SchemaDTO[]) {
    if (aTypes.length !== bTypes.length) {
        return false;
    }

    aTypes.forEach((aType) => {
        for(let i = 0; i < bTypes.length; i++) {
            const bType = bTypes[i];
            if (isCompatibleTypes(aType, bType, aEntities, bEntities)) {
                bTypes.splice(i, 1);
                return;
            } else {
                console.log('aType is NOT ok with bType', aType, bType);
            }
        }
    });

    return bTypes.length === 0;
}

export function hasEntityReference(object:any, entityName:string) {
    const values = object && object.length ? object : Object.values(object);

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