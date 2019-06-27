import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography/index';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {Divider, Button, TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

const styles = theme => ({
    root: {
        float: "left",
        padding: 15,
        paddingRight: 30,
    },
    title: {
        float: "left",
        paddingLeft: 15,
        paddingTop: 5
    },
    button: {
        float: "right",
        marginTop: 5
    },
    header: {
        float: "left",
        width: "100%",
    },
    content: {
        paddingTop: 10,
        clear: "left"
    },
    divider: {
        marginLeft: 10,
        marginTop: 5,
        marginBottom: 10,
    },
    dialogCloseSprint: {
        float: "left",
        marginLeft: 30,
        marginTop: 5
    },
    textField: {
        width: '250px',
    },
});

const getField = (field) => {
    return (
        <ListItem>
            {field}:
            <ListItemSecondaryAction>
                <input type="text"/>
            </ListItemSecondaryAction>
        </ListItem>
    )
};

class CategoryFieldsList extends React.Component {

    render() {
        const fields = [];
        this.props.category.attributes.forEach((val, i) => {
            fields.push(<TextField label={val}/>);
            fields.push(<br/>)
        });
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <form className={classes.container} noValidate>
                    <TextField label={"Name"}/>
                    <br/>
                    {fields}
                </form>

            </div>

        );
    }
}

CategoryFieldsList.propTypes = {
    classes: PropTypes.object.isRequired,
    category: PropTypes.object,
    fields: PropTypes.array,
};

export default withStyles(styles)(CategoryFieldsList);
