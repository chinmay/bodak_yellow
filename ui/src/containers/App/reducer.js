import * as actionTypes from "./actionTypes";

export const initialState = {
  lender: null,
  borrower: null,
  loan: null,
  fxData: {},
  logData: {},
  paymentData: {},
  paymentId: "",
  quoteData: {},
  quoteId: "",
  recipients: [],
  transactions: []
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CREATE_BORROWER_START:
      return { ...state, loading: true };
    case actionTypes.CREATE_BORROWER_DONE:
      return {
        ...state,
        borrower: action.data,
        serverError: false
      };
    case actionTypes.CREATE_BORROWER_FAIL:
      return {
        ...state,
        serverError: true,
        serverErrorMsg: action.data
      };

    case actionTypes.CREATE_LENDER_START:
      return { ...state, loading: true };
    case actionTypes.CREATE_LENDER_DONE:
      return {
        ...state,
        lender: action.data,
        serverError: false
      };
    case actionTypes.CREATE_LENDER_FAIL:
      return {
        ...state,
        serverError: true,
        serverErrorMsg: action.data
      };
    case actionTypes.MATCH_LENDERS_START:
      return { ...state, loading: true };
    case actionTypes.MATCH_LENDERS_DONE:
      return {
        ...state,
        loan: action.data,
        serverError: false
      };
    case actionTypes.MATCH_LENDERS_FAIL:
      return {
        ...state,
        serverError: true,
        serverErrorMsg: action.data
      };
    case actionTypes.MATCH_BORROWERS_START:
      return { ...state, loading: true };
    case actionTypes.MATCH_BORROWERS_DONE:
      return {
        ...state,
        loan: action.data,
        serverError: false
      };
    case actionTypes.MATCH_BORROWERS_FAIL:
      return {
        ...state,
        serverError: true,
        serverErrorMsg: action.data
      };
    default:
      return state;
  }
};
export default appReducer;
