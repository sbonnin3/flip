import { getRequest, putRequest } from "@/services/axios.service";

export const getEmplacements = async () => {
  return await getRequest("/api/emplacements", "GETEMPLACEMENTS");
};

export const getEmplacementById = async (id) => {
  return await getRequest(`/api/emplacements/${id}`, "GETEMPLACEMENTBYID");
};

export const checkAvailability = async (id) => {
  return await getRequest(`/api/emplacements/${id}/disponibilite`, "CHECKAVAILABILITY");
};

export const updateAvailability = async (id, data) => {
  return await putRequest(`/api/emplacements/${id}/disponibilite`, data, "UPDATEAVAILABILITY");
};