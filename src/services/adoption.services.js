import AdoptionModel from "../dao/models/Adoption.js";

export class AdoptionServices {
  create = (adoptionData) => {
    return AdoptionModel.create(adoptionData);
  };

  getAll = () => {
    return AdoptionModel.find();
  };

  getById = (id) => {
    return AdoptionModel.findById(id);
  };

  update = (id, adoptionData) => {
    return AdoptionModel.findByIdAndUpdate(id, adoptionData, { new: true });
  };

  delete = (id) => {
    return AdoptionModel.findByIdAndDelete(id);
  };
}