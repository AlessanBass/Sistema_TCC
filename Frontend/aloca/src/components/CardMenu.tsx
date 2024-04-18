import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import stiles from "@/styles/cards.module.css"
import Link from 'next/link';

interface MainProps {
    title: string; // Defina o tipo de todas as props conforme necessário
    description: string;
    icon: string;
    link: string;
}
export default function CardMenu(props: MainProps) {
    return (
        <Card  className={`${stiles.card}`}>
            {/* <CardMedia
                sx={{ height: 140 }}
                title="green iguana"
            /> */}
            <i className={`${props.icon} ${stiles.icon}`}></i>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" className={stiles.titleMain}>
                    {props.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" className={`${stiles.titleDescription}`}>
                    {props.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Link href={`${props.link}`} className={`${stiles.link}`}>
                    Acessar
                </Link>
            </CardActions>
        </Card>
    );
}