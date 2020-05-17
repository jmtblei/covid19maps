import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";
import { Help, Home } from "@material-ui/icons";

export default function SimpleMenu() {
  
    return (
      <div className="navm">
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
              <Button 
                color="primary" 
                variant="contained" 
                endIcon={<Home />}
                component={Link} to="/"
              >
                COVIDMAPS
              </Button>
              <Button 
                color="primary" 
                variant="contained" 
                endIcon={<Help />} 
                component={Link} to="/about"
              >
                About
              </Button>
        </Grid>
      </div>
    );
}
  