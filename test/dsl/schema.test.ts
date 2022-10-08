import {describe, expect, test} from "@jest/globals";
import {
    hasEntityReference,
    isBuiltInType,
    isCompatibleTypes,
    isDTO,
    isEnum,
    isList,
    isSchemaEntityCompatible,
    isStringableType,
    SchemaEntity,
    SchemaEntityType,
    toDTO,
    toEnum,
    toStringName,
    typeName,
    typeValue
} from "../../src";

const SIMPLE_ENUM: SchemaEntity = {type: SchemaEntityType.ENUM, name: 'test', values: []};
const SIMPLE_DTO: SchemaEntity = {type: SchemaEntityType.DTO, name: 'test', properties: {}};

describe('schemas', () => {

    describe('types', () => {

        test('can determine types', () => {

            expect(isDTO(SIMPLE_DTO)).toBe(true);
            expect(isDTO(SIMPLE_ENUM)).toBe(false);

            expect(isEnum(SIMPLE_DTO)).toBe(false);
            expect(isEnum(SIMPLE_ENUM)).toBe(true);

        });

        test('can cast types', () => {

            expect(toDTO(SIMPLE_DTO)).toBe(SIMPLE_DTO);
            expect(() => toDTO(SIMPLE_ENUM)).toThrow('Entity was not DTO');

            expect(toEnum(SIMPLE_ENUM)).toBe(SIMPLE_ENUM);
            expect(() => toEnum(SIMPLE_DTO)).toThrow('Entity was not enum');

        });

        test('can convert type to string', () => {

            expect(toStringName()).toBe('void');
            expect(toStringName('string')).toBe('string');
            expect(toStringName('string[]')).toBe('string[]');

            expect(toStringName({$ref: 'User'})).toBe('User');
            expect(toStringName({$ref: 'User[]'})).toBe('User[]');

        });

        test('can determine if type is list', () => {

            expect(isList()).toBe(false);
            expect(isList('string')).toBe(false);
            expect(isList('string[]')).toBe(true);

            expect(isList({$ref: 'User'})).toBe(false);
            expect(isList({$ref: 'User[]'})).toBe(true);

        });

        test('can get actual type name', () => {

            expect(typeName()).toBe('void');
            expect(typeName('string')).toBe('string');
            expect(typeName('string[]')).toBe('string');

            expect(typeName({$ref: 'User'})).toBe('User');
            expect(typeName({$ref: 'User[]'})).toBe('User');

        });

        test('can get type value', () => {

            expect(typeValue()).toBe('void');
            expect(typeValue('string')).toBe('string');
            expect(typeValue('string[]')).toBe('string[]');

            expect(typeValue({$ref: 'User'})).toBe('$ref:User');
            expect(typeValue({$ref: 'User[]'})).toBe('$ref:User[]');

        });

        test('can determine if type is built-in', () => {

            expect(isBuiltInType()).toBe(true);
            expect(isBuiltInType('string')).toBe(true);
            expect(isBuiltInType('string[]')).toBe(true);

            expect(isBuiltInType({$ref: 'User'})).toBe(false);
            expect(isBuiltInType({$ref: 'User[]'})).toBe(false);

        });

        test('can determine if type is stringable', () => {

            expect(isStringableType(null)).toBe(false);
            expect(isStringableType('string')).toBe(true);
            expect(isStringableType('string[]')).toBe(false);

            expect(isStringableType('boolean')).toBe(false);
            expect(isStringableType('float')).toBe(true);
            expect(isStringableType('float[]')).toBe(false);

            expect(isStringableType({$ref: 'User'})).toBe(false);
            expect(isStringableType({$ref: 'User[]'})).toBe(false);

        });
    });

    describe('references', () => {

        test('can determine if value has reference to entity', () => {

            expect(hasEntityReference({
                anything: [{
                    $ref: 'Test'
                }]
            }, 'Test')).toBe(true)

            expect(hasEntityReference({
                anything: [{
                    inner: [
                        {
                            $ref: 'More'
                        },{
                            $ref: 'More'
                        },{
                            $ref: 'More'
                        }
                    ]
                }]
            }, 'Test')).toBe(false);

            expect(hasEntityReference({
                anything: [{
                    inner: [
                        {
                            $ref: 'More'
                        },{
                            $ref: 'More'
                        },{
                            $ref: 'More'
                        }
                    ]
                }]
            }, 'More')).toBe(true);

            expect(hasEntityReference(null, 'More')).toBe(false);
        })
    })

    describe('comparisons', () => {

        test('can compare simple types', () => {

            expect(isCompatibleTypes(null, null, [], [])).toBe(true);
            expect(isCompatibleTypes(undefined, null, [], [])).toBe(true);
            expect(isCompatibleTypes(undefined, 'void', [], [])).toBe(true);
            expect(isCompatibleTypes('string', 'string', [], [])).toBe(true);
            expect(isCompatibleTypes('string', 'float', [], [])).toBe(true);
            expect(isCompatibleTypes('boolean', 'float', [], [])).toBe(false);
            expect(isCompatibleTypes(undefined, 'float', [], [])).toBe(false);
            expect(isCompatibleTypes('float', null, [], [])).toBe(false);

            expect(isCompatibleTypes('string[]', 'string', [], [])).toBe(false);
            expect(isCompatibleTypes('string[]', 'float[]', [], [])).toBe(true);

            expect(isCompatibleTypes('string', {$ref:'User'}, [], [])).toBe(false);
            expect(isCompatibleTypes({$ref:'User'}, 'string', [], [])).toBe(false);
        });

        test('If entities do not exist it is not compatible', () => {
            expect(isCompatibleTypes({$ref:'User'}, {$ref:'User'}, [], [])).toBe(false);

            expect(isCompatibleTypes({$ref:'User'}, {$ref:'Person'}, [], [
                {
                    type: SchemaEntityType.DTO,
                    name: 'Person',
                    properties: {}
                }
            ])).toBe(false);
        })

        test('entities of different name can be compatible', () => {
            expect(isCompatibleTypes({$ref:'User'}, {$ref:'Person'}, [
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {}
                }
            ], [
                {
                    type: SchemaEntityType.DTO,
                    name: 'Person',
                    properties: {}
                }
            ])).toBe(true);
        })

        test('Simple entity that matches is compatible', () => {

            expect(isSchemaEntityCompatible(
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {
                        id: {
                            type: 'string'
                        }
                    }
                },
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {
                        id: {
                            type: 'string'
                        }
                    }
                },
        [],[]
            )).toBe(true);

        });

        test('Simple entity that have compatible value types and same structure is compatible', () => {

            expect(isSchemaEntityCompatible(
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {
                        id: {
                            type: 'string'
                        }
                    }
                },
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {
                        id: {
                            type: 'integer'
                        }
                    }
                },
                [],[]
            )).toBe(true);

        });

        test('Simple entity with different properties is not compatible', () => {
            expect(isSchemaEntityCompatible(
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {
                        id: {
                            type: 'string'
                        },
                        name: {
                            type: 'string'
                        }
                    }
                },
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {
                        id: {
                            type: 'string'
                        }
                    }
                },
                [],[]
            )).toBe(false);

            expect(isSchemaEntityCompatible(
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {
                        id: {
                            type: 'string'
                        },
                        fullName: {
                            type: 'string'
                        }
                    }
                },
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {
                        id: {
                            type: 'string'
                        },
                        name: {
                            type: 'string'
                        }
                    }
                },
                [],[]
            )).toBe(false);
        })

        test('Simple entity with same properties but different types is not compatible', () => {
            expect(isSchemaEntityCompatible(
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {
                        id: {
                            type: 'string'
                        },
                        name: {
                            type: 'string'
                        }
                    }
                },
                {
                    type: SchemaEntityType.DTO,
                    name: 'User',
                    properties: {
                        id: {
                            type: 'string'
                        },
                        name: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        }
                    }
                },
                [],[]
            )).toBe(false);
        })

    });
});