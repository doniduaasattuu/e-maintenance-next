export type Equipment = {
  id: string;
  description: string;
  sortField: string;
  createdAt: Date;
  updatedAt: Date;
  classification: {
    id: number;
    description: string;
    type: string;
  };
  equipmentStatus: {
    id: number;
    description: string;
  };
  functionalLocation: {
    id: string;
    description: string;
  } | null;
};

export type EquipmentWitRelations = {
  id: string;
  description: string;
  sortField: string;
  createdAt: Date;
  updatedAt: Date;
  classification: {
    id: number;
    description: string;
    type: string;
  };
  equipmentStatus: {
    id: number;
    description: string;
  };
  functionalLocation: {
    id: string;
    description: string;
  } | null;
  equipmentMaterials:
    | {
        material: {
          id: string;
          name: string;
          price: number;
        };
        quantity: number;
      }[]
    | null;
  equipmentFiles:
    | {
        file: {
          id: string;
          name: string;
          path: string;
        };
      }[]
    | null;
};

// export type Equipment = {
//   id: string;
//   description: string;
//   sortField: string;
//   createdAt: Date;
//   updatedAt: Date;
//   classification: {
//     id: number;
//     description: string;
//   };
//   equipmentStatus: {
//     id: number;
//     description: string;
//   };
//   functionalLocation: {
//     id: string;
//     description: string;
//   } | null;
//   user: {
//     id: number;
//     name: string;
//   } | null;
//   equipmentMaterials:
//     | {
//         material: {
//           id: string;
//           name: string;
//           price: number;
//         };
//         quantity: number;
//       }[]
//     | null;
//   equipmentFiles:
//     | {
//         file: {
//           id: string;
//           name: string;
//           path: string;
//         };
//       }[]
//     | null;
// };

export type SimpleEquipment = {
  id: string;
  sortField: string;
  description: string;
};
