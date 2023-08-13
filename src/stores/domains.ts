import {
    v4 as uuidv4
} from 'uuid';

export const domains = [{
        id: uuidv4(),
        name: 'Products',
        description: 'Product Management',
        createdAt: (new Date()),
        updatedAt: (new Date()),
    },
    {
        id: uuidv4(),
        name: 'Orders',
        description: 'Orders Management',
        createdAt: (new Date()),
        updatedAt: (new Date()),
    },
    {
        id: uuidv4(),
        name: 'Sales',
        description: 'Sales Management',
        createdAt: (new Date()),
        updatedAt: (new Date()),
    },
    {
        id: uuidv4(),
        name: 'Customers',
        description: 'Customers Management',
        createdAt: (new Date()),
        updatedAt: (new Date()),
    },
]