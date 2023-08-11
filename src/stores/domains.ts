import {
    v4 as uuidv4
} from 'uuid';

export const domains = [{
        id: uuidv4(),
        name: 'Products',
        description: 'Product Management',
        entities: [
            {
                name: 'Product',
            }
        ],
        createdAt: (new Date()),
        updatedAt: (new Date()),
    },
    {
        id: uuidv4(),
        name: 'Orders',
        description: 'Orders Management',
        entities: [
            {
                name: 'Order',
            }
        ],
        createdAt: (new Date()),
        updatedAt: (new Date()),
    },
    {
        id: uuidv4(),
        name: 'Sales',
        description: 'Sales Management',
        entities: [
            {
                name: 'Sale',
            }
        ],
        createdAt: (new Date()),
        updatedAt: (new Date()),
    },
    {
        id: uuidv4(),
        name: 'Customers',
        description: 'Customers Management',
        entities: [
            {
                name: 'Customer',
            }
        ],
        createdAt: (new Date()),
        updatedAt: (new Date()),
    },
]