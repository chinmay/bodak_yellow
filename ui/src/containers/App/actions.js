import axios from "axios";
import * as actionTypes from "./actionTypes";

export const createLender = data => dispatch => {
  const url = `/api/lend`;
  dispatch({ type: actionTypes.CREATE_LENDER_START });

  return axios
    .post(url, { ...data })
    .then(response => {
      dispatch({
        type: actionTypes.CREATE_LENDER_DONE,
        data: response.data
      });
      return Promise.resolve(response.data);
    })
    .catch(error => {
      dispatch({ type: actionTypes.CREATE_LENDER_FAIL, data: error });
    });
};

export const createBorrower = data => dispatch => {
  const url = `/api/borrow`;
  dispatch({ type: actionTypes.CREATE_BORROWER_START });

  return axios
    .post(url, { ...data })
    .then(response => {
      dispatch({
        type: actionTypes.CREATE_BORROWER_DONE,
        data: response.data
      });
      return Promise.resolve(response.data);
    })
    .catch(error => {
      dispatch({ type: actionTypes.CREATE_BORROWER_FAIL, data: error });
    });
};

export const getLoans = data => dispatch => {
  const url = `/api/`;
  dispatch({ type: actionTypes.GET_LOANS_START });

  return axios
    .get(url, { ...data })
    .then(response => {
      dispatch({
        type: actionTypes.GET_LOANS_DONE,
        data: response.data
      });
      return Promise.resolve(response.data);
    })
    .catch(error => {
      dispatch({ type: actionTypes.GET_LOANS_FAIL, data: error });
    });
};

export const getLenders = data => dispatch => {
  const url = `/api/lenders`;
  dispatch({ type: actionTypes.GET_MARKETPLACE_LOGS_START });

  return axios
    .get(url, { ...data })
    .then(response => {
      dispatch({
        type: actionTypes.GET_MARKETPLACE_LOGS_DONE,
        data: response.data
      });
      return Promise.resolve(response.data);
    })
    .catch(error => {
      dispatch({ type: actionTypes.GET_MARKETPLACE_LOGS_FAIL, data: error });
    });
};

export const getBorrowers = data => dispatch => {
  const url = `/api/borrowers`;
  dispatch({ type: actionTypes.GET_MARKETPLACE_LOGS_START });

  return axios
    .get(url, { ...data })
    .then(response => {
      dispatch({
        type: actionTypes.GET_MARKETPLACE_LOGS_DONE,
        data: response.data
      });
      return Promise.resolve(response.data);
    })
    .catch(error => {
      dispatch({ type: actionTypes.GET_MARKETPLACE_LOGS_FAIL, data: error });
    });
};

export const matchLenders = data => dispatch => {
  const url = `/api/match/lender`;
  dispatch({ type: actionTypes.MATCH_LENDERS_START });

  return axios({
    method: "GET",
    url,
    data
  })
    .then(response => {
      dispatch({
        type: actionTypes.MATCH_LENDERS_DONE,
        data: response.data
      });
      return Promise.resolve(response.data);
    })
    .catch(error => {
      dispatch({ type: actionTypes.MATCH_LENDERS_FAIL, data: error });
    });
};

export const matchBorrowers = data => dispatch => {
  const url = `/api/match/borrower`;
  dispatch({ type: actionTypes.MATCH_BORROWERS_START });

  return axios({
    method: "GET",
    url,
    data
  })
    .then(response => {
      dispatch({
        type: actionTypes.MATCH_BORROWERS_DONE,
        data: response.data
      });
      return Promise.resolve(response.data);
    })
    .catch(error => {
      dispatch({ type: actionTypes.MATCH_BORROWERS_FAIL, data: error });
    });
};

export const getMarketplaceLogs = data => dispatch => {
  const url = `/api/create_borrower`;
  dispatch({ type: actionTypes.GET_MARKETPLACE_LOGS_START });

  return axios
    .get(url, { ...data })
    .then(response => {
      dispatch({
        type: actionTypes.GET_MARKETPLACE_LOGS_DONE,
        data: response.data
      });
      return Promise.resolve(response.data);
    })
    .catch(error => {
      dispatch({ type: actionTypes.GET_MARKETPLACE_LOGS_FAIL, data: error });
    });
};

export const clearForm = () => dispatch =>
  Promise.resolve().then(response => {
    dispatch({ type: actionTypes.CLEAR_FORM });
  });
