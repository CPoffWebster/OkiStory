
/**
 * Serializes a sequelize object to a plain object
 * @param object table object
 * @returns serialized object with dates converted to strings
 */
export function serializeTableObject(object: any) {
    const obj = object.get({ plain: true })
    if (obj.createdAt) obj.createdAt = obj.createdAt?.toString();
    if (obj.updatedAt) obj.updatedAt = obj.updatedAt?.toString();
    return obj;
}