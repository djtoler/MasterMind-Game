import React, { useState } from "react";
import { useMutate } from "restful-react";
import axios from "axios";
import Avatar from "../1ComponentHelper/Avatar";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router";
import { Button } from "@chakra-ui/button";
import { FormLabel, FormControl } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";

const Upload = () => {
  const [file, setFile] = useState("");
  const [image, setImage] = useState("");
  const [uploadedImg, setUploadedImg] = useState("");
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [picture, setPicture] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const config = { headers: { "Content-Type": "application/json" } };

  function previewFiles(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
      console.log(reader.result);
    };
    console.log(image);
  }

  const handleChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    setFile(file);
    previewFiles(file);
  };

    const handleSubmit = async (e, req, res) => {
        e.preventDefault();
        const result = await axios.post(
        "http://localhost:9991/user/upload-profile-picture",
        {
            image: image,
        }
        ).then(async (res)=>{
            console.log('in then');
            console.log(res.data)
            // sessionStorage.setItem("userInfo", JSON.stringify(data));
            // setLoading(false);
            // history.push("/home");
            try {
                const uploadedImg = result.data.public_id;
                setUploadedImg(uploadedImg);
                setLoading(true); 
                const { data } = await axios.post("http://localhost:9991/user/register",
                { name, email, password, confirmPassword, uploadedImg }, config)
                .then((data)=> {
                    console.log('in then2');
                    console.log(res.data)
                    // sessionStorage.setItem("userInfo", JSON.stringify(data));
                    // setLoading(false);
                    history.push("/home");
                })
            } catch (error) {
                console.log('in errorrrrrrrr');
                console.log(error);
                setLoading(false);
            }
        })
    }

  return (
    <VStack spacing="5px" color="black">
        <FormControl id="first-name" isRequired>
            <FormLabel>Name</FormLabel>{" "}
                <Input
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)} //Set name to whats entered in name field
                />
        </FormControl>

        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    onChange={(e)=>setEmail(e.target.value)} //Set email to whats entered in email field
                />
        </FormControl>

        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input
                type={show? 'text' : 'password'}
                placeholder='Enter Your Password'
                onChange={(e)=>setPassword(e.target.value)} //Set password to whats entered in password field
                />
                <InputRightElement width="4.5rem"> 
                    <Button h="1.75rem" size="sm" onClick={handleClick}> 
                        {show ? "Hide" : "Show"} 
                    </Button>
                </InputRightElement>
            </InputGroup>
        </FormControl>

        <FormControl id="passwordConfirm" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup size="md">
                <Input
                 type={show ? "text" : "password"}
                 placeholder="Confirm password"
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 />
                 <InputRightElement width="4.5rem">
                     <Button h="1.75rem" size="sm" onClick={handleClick}>
                         {show ? "Hide" : "Show"}
                     </Button>
                 </InputRightElement>
             </InputGroup>
         </FormControl>

        <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="fileInput">Upload your photo here</label>
            <input
            type="file"
            id="fileInput"
            onChange={(e) => handleChange(e)}
            required
            accept="image/png, image/jpeg, image.jpg, image/jfif"
            />
            <button className="btn">Submit</button>
        </form>
        <Button 
            colorScheme = "blue"
            width = "100%"
            style = {{marginTop: 15}}
            onClick = {handleSubmit}
            isLoading = {loading}
        >
            Register
        </Button>
        
        <Avatar uploadedImg={uploadedImg} />
    </VStack>
  );
};

export default Upload;
