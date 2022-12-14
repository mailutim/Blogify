import React, { useState } from "react";
import { MDBValidation, MDBInput, MDBBtn, MDBTextArea } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// p5o1yy3p
const initialState = {
  title: "",
  description: "",
  category: "",
  imageURL: "",
};
const options = ["Travel", "Fashion", "Fitness", "Sports", "Food", "Tech"];
const AddEditBlog = () => {
  const [formValue, setFormValue] = useState(initialState);
  const [categoryErrMsg, setCategoryErrMsg] = useState(null);
  const { title, description, category, imageURL } = formValue;
  const navigate = useNavigate();
  const getDate = () => {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, "0")
    let mm = String(today.getMonth()+ 1).padStart(2, "0")
    let yyyy = today.getFullYear();

    today = mm + "/" + dd + "/" + yyyy
    return today;

  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      setCategoryErrMsg("Please select a category");
    }
    if(title && description && imageURL && category){
        const currentDate = getDate();
        const updatedBlogData = {...formValue, date: currentDate}
        const response = await axios.post("http://localhost:5000/blogs", updatedBlogData)
        if(response.status === 201) {
            toast.success("Blog created Successfully")
        } else {
            toast.error ("Something went wrong")
        }
        setFormValue({title: "", description: "", category: "", imageURL: ""})
        navigate("/")

    }
  };

  const onInputChange = (e) => {
    let { name, value } = e.target;
    setFormValue({ ...formValue, [name]: value });
  };

  const onUploadImage = (file) => {
    console.log("file", file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "p5o1yy3p");
    axios
      .post("http://api.cloudinary.com/v1_1/dscyw0ewi/image/upload", formData)
      .then((resp) => {
        toast.info("image Uploaded Succesffully");
        setFormValue({ ...formValue, imageURL: resp.data.url });
      })
      .catch((err) => {
        toast.info("something went wrong");
      });
  };

  const onCategoryChange = (e) => {
    setCategoryErrMsg(null);
    setFormValue({ ...formValue, category: e.target.value });
  };
  return (
    <MDBValidation
      className="row g-3"
      style={{ marginTop: "100px" }}
      noValidate
      onSubmit={handleSubmit}
    >
      <p className="fs-2 fw-bold">Add Blog</p>
      <div
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
      >
        <MDBInput
          value={title || ""}
          name="title"
          type="text"
          onChange={onInputChange}
          required
          label="Title"
          validation="Please provide a title"
          invalid
        />
        <br />
        <MDBTextArea
          value={description || ""}
          name="description"
          type="text"
          onChange={onInputChange}
          required
          label="Description"
          validation="Please provide a Description"
          textarea
          rows={4}
          invalid
        />
        <br />
        <MDBInput
          type="file"
          onChange={(e) => onUploadImage(e.target.files[0])}
          required
          validation="Please provide a title"
          invalid
        />
        <br />
        <select
          className="categoryDrpDown"
          onChange={onCategoryChange}
          value={category}
        >
          <option>Please select category</option>
          {options.map((option, index) => (
            <option value={option || ""} key={index}>
              {option}
            </option>
          ))}
        </select>
        {categoryErrMsg && (
          <div className="categoryErrorMsg">{categoryErrMsg}</div>
        )}

        <br />
        <br />
        <MDBBtn type="submit" style={{ marginRight: "10px" }} >
          Add
        </MDBBtn>
        <MDBBtn
          color="danger"
          style={{ marginRight: "10px" }}
          onClick={() => navigate("/")}
        >
          Go Back
        </MDBBtn>
      </div>
    </MDBValidation>
  );
};

export default AddEditBlog;
