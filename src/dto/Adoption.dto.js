export default class AdoptionDTO {
    
    static getAdoptionInputFrom({ owner, pet }) {
      if (!owner || !pet) {
        throw new Error("Owner and Pet are required to create an adoption.");
      }
  
      return {
        owner,  
        pet,    
        adoptedAt: new Date(),  
      };
    }
  
    
    static getAdoptionOutputFrom(adoption) {
      if (!adoption) {
        throw new Error("Adoption not found.");
      }
  
      return {
        id: adoption._id,
        owner: adoption.owner,
        pet: adoption.pet,
        adoptedAt: adoption.adoptedAt,
      };
    }
  }
  