import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from "@material-ui/core";

import { useHistory } from "react-router-dom";

import { useDispatch } from "react-redux";

import { signin, signup } from "../../actions/auth.js";

import jwt_decode from "jwt-decode";

import LockOutlinedIcon from "@material-ui/icons/LockOutlined.js";

import Input from "./Input.js";

import useStyles from "./styles.js";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const classes = useStyles();

  const [showPassword, setShowPassword] = useState(false);

  const [isSignup, setIsSignup] = useState(false);

  const [formData, setFormData] = useState(initialState);

  const dispatch = useDispatch();

  const history = useHistory();

  const GoogleSucess = async (response) => {
    const decode = jwt_decode(response.credential);

    const result = {
      id: decode.aud,
      image: decode.picture,
      name: decode.name,
    };

    const token = decode.jti;

    console.log(decode);

    try {
      dispatch({ type: "AUTH", data: { result, token } });

      history.push(".");
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      dispatch(signup(formData, history));
    } else {
      dispatch(signin(formData, history));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isSignup ? "Sign up" : "Sign in"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input
                  name="firstName"
                  label="First Name"
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name="lastName"
                  label="Last Name"
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name="email"
              label="Email Address"
              handleChange={handleChange}
              type="email"
            />
            <Input
              name="password"
              label="Password"
              handleChange={handleChange}
              type={showPassword ? "text" : "password"}
              handleShowPassword={handleShowPassword}
            />
            {isSignup && (
              <Input
                name="confirmPassword"
                label="Repeat password"
                handleChange={handleChange}
                type="password"
              />
            )}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>
          <GoogleLogin
            theme="filled_blue"
            size="large"
            text="signin"
            onSuccess={(response) => {
              GoogleSucess(response);
            }}
            onError={(error) => {
              console.log(error);
            }}
          />
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button onClick={switchMode}>
                {isSignup
                  ? "Already have an account? Sign In"
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
