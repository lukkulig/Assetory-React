import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import HighlightOffIcon from "@material-ui/icons/HighlightOff"

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    grid: {
        float: "left",
        marginLeft: 10,
        marginRight: 10,
    },
    filterButton: {
        marginRight: theme.spacing(1),
        marginBottom: theme.spacing(1),
        textAlign: 'center'
    },
});

class ActiveFilters extends React.Component {

    state = {
        filters: {},
    };

    componentDidMount() {
        this.setState({filters: this.props.filters});
    }


    render() {
        const {classes, filters} = this.props;

        const filtersList = [];
        let i = 0;
        for (let key in filters) {
            if (filters.hasOwnProperty(key)) {
                filtersList.push(
                    <Button className={classes.filterButton}
                            variant="outlined"
                            filters={this.state.filters}
                            onClick={this.handleClickOpen}
                            key={i}
                    >
                        <p>{key + " : " + filters[key]}</p>
                        <HighlightOffIcon/>
                    </Button>);
                i++;
            }
        }

        return (

            <div className={classes.root}>
                <Grid className={classes.grid} container item xs={12} justify="flex-start">
                    <p className={classes.filterButton}>
                        Active filters:
                    </p>
                    {filtersList}
                </Grid>
            </div>
        )
            ;
    }
}

ActiveFilters.propTypes = {
    classes: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActiveFilters)