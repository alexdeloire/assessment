import React, { useState, useEffect } from "react";
import PostDataService from "../services/post.service";
import Pagination from "@mui/material/Pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import getRequestParams from "../utils/getRequestParams";
import PostDetails from "./PostDetails";


// Global variables
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = { // Used for MaterialUI Select Menu
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};


function App() {

  /*******************
   *     States      *
   *******************/

  // States for posts
  const [posts, setPosts] = useState([]); // Fetched from the api
  const [currentPost, setCurrentPost] = useState(null); // Current post selected

  // States for search filter
  const [categories, setCategories] = useState([]); // The user will pick from these, they are fetched from the api
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  // hasChanged indicates if the values in the search filter has changed
  // This is to allow the code to go back to the first page after a different search, which is a functionality I want
  const [hasChanged, setHasChanged] = useState(false);

  // States for pagination
  const [count, setCount] = useState(0); // Total number of posts
  const [page, setPage] = useState(1); // Number of pages
  const [pageSize, setPageSize] = useState(3); // Current Page size
  const [currentIndex, setCurrentIndex] = useState(-1); // Index of selected post
  const pageSizes = [3, 6, 9];
  
  
  useEffect(() => {
    /**
     * Fetches categories data from the server and sets it in the component state.
     * @async
     * @function
     * @returns {Promise<void>}
     */
    const getCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await PostDataService.fetchCategories();
        setCategories(response.data);
        setLoadingCategories(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    getCategories(); // Fetch the categories
    retrievePosts([], 1, pageSize, hasChanged);
  }, []);

  /**
   * Retrieves posts based on selected values, page number, page size, and change status.
   * @param {Array} selectedValues - The selected values.
   * @param {number} pageToSend - The page number to send.
   * @param {number} pageSize - The page size.
   * @param {boolean} hasChanged - Indicates if there has been a change in the search filter.
   */
  const retrievePosts = (selectedValues, pageToSend, pageSize, hasChanged) => {
    pageToSend = hasChanged ? 1 : pageToSend;
    setHasChanged(false);
    const params = getRequestParams(selectedValues, pageToSend, pageSize);


    PostDataService.getAll(params)
      .then((response) => {
        const { items, totalPages } = response.data;

        setPosts(items);
        setCount(totalPages);
        setPage(pageToSend);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const refreshList = () => {
    retrievePosts();
    setCurrentPost(null);
    setCurrentIndex(-1);
  };

  /**
   * Sets the current active post and index.
   * @param {any} post - The post to set as active.
   * @param {number} index - The index of the post to set as active.
   */
  const setActivePost = (post, index) => {
    setCurrentPost(post);
    setCurrentIndex(index);
  };

  /**
   * Handles the change of the current page. Fetches new posts.
   * @param {object} event - The event object.
   * @param {number} value - The new page value.
   * @returns {void}
   */
  const handlePageChange = (event, value) => {
    setPage(value);
    setCurrentIndex(-1);
    retrievePosts(selectedValues, value, pageSize, hasChanged);
  };

  /**
   * Updates the page size and retrieves the posts with the new page size.
   * @param {Object} event - The event object.
   */
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
    retrievePosts(selectedValues, 1, event.target.value, hasChanged);
  };

  /**
   * Handles the change event of the input field.
   * @param {Event} event - The change event object.
   */
  const handleChange = (event) => {
    setHasChanged(true);
    const {
      target: { value },
    } = event;
    setSelectedValues(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };


  return (
    <div className="wrapper-for-everything">
      <div className="list row">
        <div className="col-md-8 search-posts">
          <div className="input-group mb-3 justify-content-center">

            <div className="input-custom">
              <FormControl sx={{ m: 0.1, width: '100%' }}>
                <InputLabel sx={{ m: 0.1 }} id="multiple-checkbox-label">Tag</InputLabel>
                <Select
                  labelId="multiple-checkbox-label"
                  id="multiple-checkbox"
                  multiple
                  value={selectedValues}
                  onChange={handleChange}
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                {loadingCategories ? (
                    "Loading"
                  ) : (
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        <Checkbox checked={selectedValues.includes(category.name)} />
                        <ListItemText primary={category.name} />
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
            </div>

            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary search-button"
                type="button"
                onClick={() => {retrievePosts(selectedValues, 1, pageSize, true);} }
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6 ml-3 mr-3">
          <h4>Post List</h4>
          <div className="mt-3">
            {"Posts per Page: "}
            <select onChange={handlePageSizeChange} value={pageSize}>
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <ul className="list-group mt-3">
            {posts &&
              posts.map((post, index) => (
                <li
                  className={
                    "list-group-item " +
                    (index === currentIndex || (currentPost ? post.title === currentPost.title : false)
                      ? "active"
                      : "")
                  }
                  onClick={() => setActivePost(post, index)}
                  key={index}
                >
                  {post.title}
                </li>
              ))}
            </ul>

            <Pagination
              className="my-3 mt-3"
              count={count}
              page={page}
              siblingCount={1}
              boundaryCount={1}
              variant="outlined"
              shape="rounded"
              onChange={handlePageChange}
            />
          </div>
        </div>

        <div className="col-md-5 display-item">
          {currentPost ? (
            <PostDetails currentPost={currentPost} />
          ) : (
            <div>
              <br />
              <p>Don't be shy, <strong>select</strong> an post!</p>
            </div>
          )}
        </div>

      </div>
      
    </div>
  );
}


export default App;
