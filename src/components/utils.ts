export function buildEntitySpec(name: string, properties: Record<string, any>[]) {
    const spec: Record<string, any> = {};
    spec[name] = {
        required: [],
        properties: {
            
        }
    }
    for(const property of properties) {
        spec[name].properties[property.name] = { ...property.spec, description: property.description || '' }
    }
    return spec
}