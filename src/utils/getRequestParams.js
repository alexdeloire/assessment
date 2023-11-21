/**
   * Returns the request parameters for a given set of options, page, and pageSize.
   * @param {Object} options - The search options.
   * @param {number} page - The page number.
   * @param {number} pageSize - The number of items per page.
   * @returns {Object} - The request parameters.
   */
const getRequestParams = (options, page, pageSize) => {
    let params = {};

    if (options) {
      params["searchOptions"] = options;
    }

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["pageSize"] = pageSize;
    }

    return params;
  };

export default getRequestParams;