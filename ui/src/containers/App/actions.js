import axios from "axios";
import * as actionTypes from "./actionTypes";

export const createLender = params => dispatch => {
  const url = `/api/create_lender`;
  dispatch({ type: actionTypes.CREATE_LENDER_START });

  return axios
    .post(url, { params })
    .then(response => {
      dispatch({
        type: actionTypes.CREATE_LENDER_DONE,
        data: response.data[0]
      });
      return Promise.resolve(response.data[0]);
    })
    .catch(error => {
      dispatch({ type: actionTypes.CREATE_LENDER_FAIL, data: error });
    });
};

export const createBorrower = params => dispatch => {
  const url = `/api/create_borrower`;
  dispatch({ type: actionTypes.CREATE_BORROWER_START });

  return axios
    .post(url, { params })
    .then(response => {
      dispatch({
        type: actionTypes.CREATE_BORROWER_DONE,
        data: response.data[0]
      });
      return Promise.resolve(response.data[0]);
    })
    .catch(error => {
      dispatch({ type: actionTypes.CREATE_BORROWER_FAIL, data: error });
    });
};

export const getLoans = params => dispatch => {
  const url = `/api/create_borrower`;
  dispatch({ type: actionTypes.GET_LOANS_START });

  return axios
    .get(url, { params })
    .then(response => {
      dispatch({
        type: actionTypes.GET_LOANS_DONE,
        data: response.data[0]
      });
      return Promise.resolve(response.data[0]);
    })
    .catch(error => {
      dispatch({ type: actionTypes.GET_LOANS_FAIL, data: error });
    });
};

export const getMarketplaceLogs = params => dispatch => {
  const url = `/api/create_borrower`;
  dispatch({ type: actionTypes.GET_MARKETPLACE_LOGS_START });

  return axios
    .get(url, { params })
    .then(response => {
      dispatch({
        type: actionTypes.GET_MARKETPLACE_LOGS_DONE,
        data: response.data[0]
      });
      return Promise.resolve(response.data[0]);
    })
    .catch(error => {
      dispatch({ type: actionTypes.GET_MARKETPLACE_LOGS_FAIL, data: error });
    });
};

export const clearForm = () => dispatch =>
  Promise.resolve().then(response => {
    dispatch({ type: actionTypes.CLEAR_FORM });
  });
