import React from "react";
import {
    GitHub,
} from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export default () => {
    return (
        <div className="footer-container">
            <div className="footer-text-container">
                <p>
                    This website uses publicly available data from various sources including but not limited to collaborative and collective efforts, local governments, WHO, and John Hopkins CSSE. The contents of this website are not guaranteed to be accurate or updated in a timely manner, and are for informational purposes only. Reliance on this website for medical guidance is advised against.
                </p>
            </div>
            <div> 
                © 2020
                <a href="https://github.com/jmtblei/covid19maps" target="_blank" rel="noopener noreferrer" className="icon-link">
                    <IconButton aria-label="github" color="inherit" className="icon-color">
                        <GitHub />
                    </IconButton>
                </a>
            </div>
        </div>
    )
}