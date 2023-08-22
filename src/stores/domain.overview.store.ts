import { defineStore } from 'pinia';
import Swal from 'sweetalert2';
import type { EntitySchema } from '@/database/EntitySchema';
import type { PropertySchema } from '@/database/PropertySchema';
import { PropertyModel } from '@/models/PropertyModel';
import { OASFormats } from '@/components/OAS';
import { useAlertStore } from '@/stores/alert.store';
import { useDomainsStore } from '@/stores/domains.store';
import type { IPropertyCreateDTO } from '@/models/IPropertyCreateDTO';
import { EntityModel } from '@/models/EntityModel';
import type { IEntityCreateDTO } from '../models/IEntityCreateDTO';

export const useDomainOverviewStore = defineStore({
    id: 'domainOverview',
    state: () => ({
        loading: false,
        selectedDomain: '',
        
        selectedDataEntity: {} as EntitySchema,
        entityFormMode: 'create',
        entityFormTitle: 'New data entity',
        panelEntitySelected: 'listing',
        
        selectedProperty: {} as PropertySchema,
        propertyFormMode: 'create',
        propertyFormTitle: 'New property',
        
        // editingProperty: {},
        panelPropertySelected: 'listing',
        selectedDataType: '',
        selectedFormats: [] as string[],

        entities: [ ] as EntitySchema[],
        properties: [] as PropertySchema[],
        reDrawGraph: 0,
    }),
    actions: {
        async setPanelEntitySelected(panelType: string) {
            this.panelEntitySelected = panelType;
            this.setSelectedProperty('');
            this.setpropertyFormTitle('New property');
            this.setPropertyFormMode('create');
            this.selectPanelPropertyTab('listing');
            // await this.getPropertiesByDataEntityId(id);
        },
        async setSelectedDomain(id: string) {
            this.selectedDomain = id;
            const domainStore = useDomainsStore();
            await domainStore.getRecord(id);
        },
        setPropertyFormMode(mode: string) {
            this.propertyFormMode = mode;
        },
        async setSelectedDataEntity(id: string) {
            try {
                const document = await EntityModel.get(id)
                this.selectedDataEntity = document;
                await this.getPropertiesByDataEntityId(id);
                this.setSelectedProperty('');
                this.setpropertyFormTitle('New property');
                this.setPropertyFormMode('create');
                this.selectPanelPropertyTab('listing');
            } catch (error) {
                console.log(error)
            }

        },
        async setSelectedProperty(id: string) {
            if(id === '') {
                this.selectedProperty = {} as PropertySchema;
                return;
            }
            this.selectedProperty = await PropertyModel.get(id) || {};
            
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
        },

        async saveOrUpdateProperty (hash: IPropertyCreateDTO) {
            this.loading = true;
            console.log('this.selectedProperty', this.selectedProperty)
            console.log('this.propertyFormMode', this.propertyFormMode)
            console.log(hash);
            let updated: any;
            let action: string;
            if(this.propertyFormMode === 'create') {
                console.log('SAVE')
                const model = new PropertyModel(hash);
                console.log(model);
                updated = await model.save();
                action = 'saved';
            } else {
                console.log('UPDATE')
                updated = await PropertyModel.update(this.selectedProperty.id, hash);
                action = 'updated';
            }
            console.log(updated)
            this.setPropertyFormMode('create');
            this.setpropertyFormTitle('New property');
            // select data entity and rebuild property panel
            // await this.setSelectedDataEntity(this.selectedDataEntity.id);

            this.selectPanelPropertyTab('listing');
            // console.log(this.properties[0].id)
            await this.getPropertiesByDataEntityId(this.selectedDataEntity.id);
            await this.setSelectedProperty(updated.id);

            const alertStore = useAlertStore();
            alertStore.success(`Property is ${action}`);
            this.reDrawGraph += 1;
            this.loading = false;
        },
        
        async saveOrUpdateEntity(hash: IEntityCreateDTO) {
            try {
                this.loading = true;
                let updated: any;
                console.log()
                if(this.entityFormMode === 'create') {
                    console.log('SAVE')
                    const model = new EntityModel(hash);
                    console.log(model);
                    updated = await model.save();
                    console.log(updated)
                } else {
                    console.log('UPDATE')
                    updated = await EntityModel.update(this.selectedDataEntity.id, hash);
                }
                console.log(updated)
                // await this.setSelectedDataEntity(updated.id)

                // this.selectedDataEntity = updated;
                this.panelEntitySelected = 'listing';
                this.entityFormTitle = 'New data entity';
                this.entityFormMode = 'create';
                this.entities = await EntityModel.getAllByFilter('domain_id', this.selectedDomain);

                this.setSelectedDataEntity(updated.id)
                // await this.getPropertiesByDataEntityId(id);
                // this.setSelectedProperty('');
                // this.setpropertyFormTitle('New property');
                // this.setPropertyFormMode('create');
                // this.selectPanelPropertyTab('listing');

                const alertStore = useAlertStore();
                alertStore.success('Entity is saved');
                this.reDrawGraph = this.reDrawGraph + 11;
                this.loading = false;
            } catch (error) {
                console.log(error)
            }
        },

        async duplicateProperty(id: string): Promise<void> {
            this.loading = true
            const { isConfirmed } = await Swal.fire({
                title: 'Duplicate property',
                html: 'Do you really want to duplicate it?',
                confirmButtonText: 'yes',
                showCancelButton: true,
                customClass: {
                    confirmButton: 'button is-danger',
                    cancelButton: 'button is-success',
                }
            });
            if (isConfirmed) {
                // console.log(id)
                const document = await PropertyModel.get(id);
                const newRawDoc: any = { ...document, name: document.name + ' copy ' + Math.random() };
                delete newRawDoc.id;
                const newModel = new PropertyModel(newRawDoc);
                await newModel.save();
                await this.getPropertiesByDataEntityId(this.selectedDataEntity.id);
                const alertStore = useAlertStore();
                alertStore.warning('The property is duplicated')
                this.loading = false;
                // this.selectedProperty = {} as PropertySchema;
                this.reDrawGraph += 1;
            } else {
                this.loading = false;
            }
        },
        async removeProperty(id: string): Promise<void> {
            this.loading = true
            const { isConfirmed } = await Swal.fire({
                title: 'Delete property',
                html: 'Do you really want to delete it?',
                confirmButtonText: 'yes',
                showCancelButton: true,
                customClass: {
                    confirmButton: 'button is-danger',
                    cancelButton: 'button is-success',
                }
            });
            if (isConfirmed) {
                // console.log(id)
                await PropertyModel.remove(id);
                await this.getPropertiesByDataEntityId(this.selectedDataEntity.id);
                const alertStore = useAlertStore();
                alertStore.warning('The document is deleted')
                this.loading = false;
                this.selectedProperty = {} as PropertySchema;
                this.reDrawGraph += 1;
            } else {
                this.loading = false;
            }
        },
    }
});
