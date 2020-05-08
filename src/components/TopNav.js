import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button, Menu, MenuItem, IconButton, Grid } from "@material-ui/core";
import { Help, Home } from "@material-ui/icons";

export default function SimpleMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          Filter by view
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
            <Link to="/">
                <MenuItem onClick={handleClose}>Confirmed Cases (All Time)</MenuItem>
            </Link>
            <Link to="/confirmed-24h">
                <MenuItem onClick={handleClose}>Confirmed Cases (24H)</MenuItem>
            </Link>
            <Link to="/deaths-24h">
                <MenuItem onClick={handleClose}>Confirmed Deaths (24H)</MenuItem>
            </Link>
            <Link to="/deaths-all-time">
                <MenuItem onClick={handleClose}>Confirmed Deaths (All Time)</MenuItem>
            </Link>
        </Menu>
        <div>
            <IconButton color="primary" aria-label="home" component={Link} to="/">
                <Home />
            </IconButton>
            <IconButton color="primary" aria-label="about" component={Link} to="/about">
                <Help />
            </IconButton>
        </div>
      </Grid>
    );
}
  