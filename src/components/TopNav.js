import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Button, Grid, Menu, MenuItem, AppBar, Toolbar, Typography } from "@material-ui/core";
import { Help, FilterList } from "@material-ui/icons";

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const toggleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  
  const toggleClose = () => {
    setAnchorEl(null);
  };
  
    return (
      <div className="navm">
        <AppBar position="static">
          <Toolbar>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Button 
                aria-controls="simple-menu" 
                aria-haspopup="true" 
                onClick={toggleClick}
                endIcon={<FilterList />}
                style={{color:"white"}}
              >
                Filter by view
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={toggleClose}
              >
                <MenuItem onClick={toggleClose} component={Link} to="/">Confirmed Cases (All Time)</MenuItem>
                <MenuItem onClick={toggleClose} component={Link} to="/confirmed-24h">Confirmed Cases (24H)</MenuItem>
                <MenuItem onClick={toggleClose} component={Link} to="/deaths-24h">Confirmed Deaths (24H)</MenuItem>
                <MenuItem onClick={toggleClose} component={Link} to="/deaths-all-time">Confirmed Deaths (All Time)</MenuItem>
              </Menu>
              <Typography variant="h6">COVID-19 MAPS</Typography>
              <Button 
                component={Link} to="/about"
              >
                <Help style={{color:"white"}}/>
              </Button>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
}
  