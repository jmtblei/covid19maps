import React from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActionArea,
  Grid,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import { useStyles } from "../styles";

const placeholderImg =
  "https://pfolioimgs.s3-us-west-1.amazonaws.com/c19m300.png";

export default () => {
  const newsData = useSelector((state) => state.newsData);
  const styles = useStyles();

  return (
    <Grid container spacing={4} className={styles.news}>
      {newsData.value.map((news, i) => (
          <Grid item>
            <Card className={styles.newsCard}>
            <CardActionArea href={news.url} target="_blank" rel="noopener noreferrer">
                <CardHeader className={styles.newsHeader}
                avatar={
                    <Avatar aria-label={news.provider[0]?.name}>
                    <img
                        src={news.provider[0]?.image?.thumbnail?.contentUrl || {placeholderImg}}
                        alt=""
                        className={styles.newsThumb}
                    ></img>
                    </Avatar>
                }
                title={news.name}
                subheader={`${moment(news.datePublished).startOf("ss").fromNow()} by ${news.provider[0]?.name}`}
                />
                <CardMedia className={styles.newsMedia}>
                <img src={news?.image?.thumbnail?.contentUrl || { placeholderImg }}alt="" className={styles.newsImage}></img>
                    <CardContent>
                        <Typography variant="caption">
                            {news.description.length > 150
                            ? `${news.description.substring(0, 150)}...`
                            : news.description}
                        </Typography>
                    </CardContent>
                </CardMedia>
            </CardActionArea>
            </Card>
          </Grid>
      ))}
    </Grid>
  );
};
