import { defineStore } from 'pinia';
import type { EntitySchema } from '@/database/EntitySchema';
import type { PropertySchema } from '@/database/PropertySchema';
import { PropertyModel } from '@/models/PropertyModel';
import { OASFormats } from '@/components/OAS';


export const useDomainOverviewStore = defineStore({
    id: 'domainOverview',
    state: () => ({
        selectedDataEntity: '',
        
        propertyFormTitle: 'New property',
        selectedProperty: '',
        panelPropertySelected: 'listing',
        selectedDataType: '',
        selectedFormats: [] as string[],

        entities: [ ] as EntitySchema[],
        properties: [] as PropertySchema[],
    }),
    actions: {
        async setSelectedDataEntity(id: string) {
            this.selectedDataEntity = id;
            await this.getPropertiesByDataEntityId(id);
        },
        setSelectedProperty(id: string) {
            this.selectedProperty = id;
        },
        setpropertyFormTitle(title: string) {
            this.propertyFormTitle = title;
        },
        async getPropertiesByDataEntityId (entity_id: string) {
            this.properties = await PropertyModel.getAllByFilter('entity_id', entity_id);
        },
        selectPanelPropertyTab (value: string) {
            if(value === 'form' && this.panelPropertySelected !== 'form') {
                this.selectedDataType = '';
            }
            this.panelPropertySelected = value
        },
        selectDataTypes(event: Event) {
            const type = (event.target as HTMLSelectElement).value;
            console.log(type);
            this.selectedDataType = type

            this.selectedFormats = OASFormats[type];
        }
    }
});
