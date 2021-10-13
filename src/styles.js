import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    news: {
        margin: "auto",
        justifyContent: "center",
    },
    newsCard: {
        width: 350,
        height: 250,
        margin: 10,
    },
    newsHeader: {
        padding: 10
    },
    newsThumb: {
        maxHeight: 50,
    },
    newsMedia: {
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
    },
    newsImage: {
        maxHeight: 100,
    },
}));