import React from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import InlineEdit from '@atlaskit/inline-edit';
import Textfield from '@atlaskit/textfield';
import {DatePicker} from '@atlaskit/datetime-picker';
import Paper from "@material-ui/core/Paper";
import DeleteAssetDialog from "./DeleteAssetDialog";
import AddRelatedAssetDialog from "./AddRelatedAssetDialog";
import api from "../../../api";
import ComputerInformation from "./ComputerInformation";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import {Delete, ExpandMore} from '@material-ui/icons';
import {BeatLoader} from "react-spinners";
import ListSubheader from "@material-ui/core/ListSubheader";
import Tooltip from "@material-ui/core/Tooltip";

const styles = ({
    title: {
        marginRight: 5
    },
    titleTag: {},
    deleteButton: {
        float: "right",
    },
    grid: {
        float: "left",
    },
    expansionPanelDetails: {
        padding: '25px 50px',
        display: 'grid',
        gridTemplateRows: 'min-content auto',
        gridTemplateAreas: `'assetInfo'
                            'computerInfo'`,
        gridColumnGap: 50
    },
    assetInfo: {
        gridArea: 'assetInfo',
        display: 'grid',
        gridTemplateColumns: 'auto minmax(min-content, 30%)',
        gridTemplateAreas: `'form relatedAssets'`,
        paddingBottom: '15px'
    },
    form: {
        gridArea: 'form',
        display: 'flex',
        flexWrap: 'wrap',
    },
    inlineEdit: {
        width: '200px',
        marginRight: '15px',
        paddingBottom: 10,
    },
    field: {
        width: '200px'
    },
    readViewContainer: {
        display: 'flex',
        fontSize: '14px',
        lineHeight: '1.5',
        maxWidth: '100%',
        minHeight: '40px',
        padding: '8px 6px',
        wordBreak: 'break-word',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
        borderColor: 'whitesmoke',
        borderRadius: '3px',
        borderWidth: '2px',
        borderStyle: 'solid',
    },
    relatedAssets: {
        gridArea: 'relatedAssets',
        width: "100%",
        marginRight: '20px',
        padding: '10px',
    },
    listSubheaderText: {
        fontSize: 16,
        color: "#6B778C"
    },
    listSubheaderIconButton: {
        float: 'right',
        marginRight: '-12px'
    },
    listItemPrimaryText: {
        fontSize: 14
    },
    computerInfo: {
        gridArea: 'computerInfo',
        backgroundColor: 'whitesmoke',
        padding: '15px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    expansionPanelActions: {
        float: 'left',
        paddingLeft: 20
    },
    noContent: {
        width: "100%",
        textAlign: "center",
        paddingTop: 10,
        paddingBottom: 10
    }
});

class AssetView extends React.Component {

    state = {
        attributes: [],
        relatedAssets: null
    };

    isLoading() {
        return this.state.relatedAssets === null
    }

    componentDidMount() {
        this.setState({attributes: this.props.asset.attributes});
        this.fetchAndSetRelatedAssets();
    }

    fetchAndSetRelatedAssets = () => {
        api.fetch(
            api.endpoints.getAssetsByIds(this.props.asset.relatedAssetsIds),
            (assets) => {
                let result = assets.map(asset => ({
                    id: asset.id,
                    name: asset.name,
                    categoryId: asset.categoryId
                }));
                this.setState({relatedAssets: result});
            }
        );
    };

    static getAttributeValuesWithColor(attr) {
        if (attr.value) {
            if (attr.attribute.type !== "date") {
                return {value: attr.value, textColor: 'default'};
            } else {
                return {value: new Date(attr.value).toLocaleDateString(), textColor: 'default'};
            }
        } else if (attr.attribute.required) {
            return {value: 'Please fill in this field', textColor: 'red'};
        }
        return {value: '', textColor: 'default'};
    }

    handleUpdateAssetAttributes = (attr, value) => {
        let attributesUpdate = {
            id: this.props.asset.id,
            attributes: {}
        };
        attributesUpdate.attributes[attr.name] = value;

        this.setState(prevState => ({
            attributes: prevState.attributes.map(
                el => el.attribute === attr ? {...el, value: value} : el
            )
        }));

        api.fetch(
            api.endpoints.updateAssetAttributes(attributesUpdate), () => {
                this.props.assetsUpdateCallback(attributesUpdate.attributes);
            }
        );
    };

    handleRedirectToRelatedAsset = (relatedAsset) => {
        this.props.assetsRedirectCallback(relatedAsset.categoryId, relatedAsset.id);
    };

    handleAddRelatedAsset = (related) => {
        let relatedAssetIds = related.map(r => r.id);
        api.fetch(
            api.endpoints.addRelatedAssets(this.props.asset.id, relatedAssetIds), () => {
                this.setState({relatedAssets: related});

            }
        );
    };

    handleDeleteRelatedAsset = (relatedAsset) => {
        let relatedAssets = this.state.relatedAssets;
        api.fetch(
            api.endpoints.deleteRelatedAssets(this.props.asset.id, relatedAsset.id), () => {
                this.setState({relatedAssets: relatedAssets.filter(asset => asset.id !== relatedAsset.id)});
            }
        );
    };

    handleDeleteAsset = () => {
        this.props.assetsDeleteCallback();
    };

    render() {
        const {classes, asset, open, categories} = this.props;
        const language = navigator.language;
        const attributesEditable = [];
        this.state.attributes.forEach((attr, i) => {
            let {value, textColor} = AssetView.getAttributeValuesWithColor(attr);
            attributesEditable.push(
                <div className={classes.inlineEdit} key={i}>
                    <InlineEdit
                        defaultValue={attr.value}
                        label={attr.attribute.name}
                        isRequired={attr.attribute.required}
                        editView={fieldProps => (attr.attribute.type !== "date") ?
                            <Textfield {...fieldProps} className={classes.field} type={attr.attribute.type}
                                       autoFocus/>
                            :
                            <DatePicker {...fieldProps} className={classes.field} locale={language} autoFocus/>
                        }
                        readView={() => (
                            <div className={classes.readViewContainer}
                                 style={{color: textColor}}>
                                {value}
                            </div>
                        )}
                        onConfirm={(value) => this.handleUpdateAssetAttributes(attr.attribute, value)}
                        readViewFitContainerWidth
                        keepEditViewOpenOnBlur
                    />
                </div>
            );
        });

        return (
            <ExpansionPanel defaultExpanded={open}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMore/>}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                >
                    <Typography className={classes.title} variant="h6">
                        {asset.name}
                    </Typography>
                    <Typography className={classes.titleTag} variant="overline" color="textSecondary">
                        {asset.category}
                    </Typography>
                </ExpansionPanelSummary>
                <Divider/>
                {!this.isLoading() ? (
                    <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                        <div className={classes.assetInfo}>
                            <List className={classes.form} dense component={"ul"}>
                                {attributesEditable}
                            </List>
                            <Paper className={classes.relatedAssets}>
                                <List dense={false}
                                      subheader={
                                          <ListSubheader classes={{root: classes.listSubheaderText}}
                                                         disableSticky={true}>
                                              <AddRelatedAssetDialog
                                                  relatedAssets={this.state.relatedAssets}
                                                  categories={categories}
                                                  assetViewCallback={this.handleAddRelatedAsset}
                                              />
                                              <Divider/>
                                          </ListSubheader>
                                      }>
                                    {this.state.relatedAssets.length ? (
                                        this.state.relatedAssets.map(value => (
                                            <Tooltip key={value.id} title="Go to this asset">
                                                <ListItem button
                                                          onClick={() => this.handleRedirectToRelatedAsset(value)}>
                                                    <ListItemText classes={{primary: classes.listItemPrimaryText}}
                                                                  primary={value.name}
                                                    />
                                                    <ListItemSecondaryAction>
                                                        <Tooltip title="Delete related asset">
                                                            <IconButton edge="end"
                                                                        onClick={() => this.handleDeleteRelatedAsset(value)}>
                                                                <Delete/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
                                            </Tooltip>
                                        ))
                                    ) : (
                                        <Typography className={classes.noContent} color="textSecondary">
                                            There's no related assets
                                        </Typography>
                                    )
                                    }
                                </List>
                            </Paper>
                        </div>
                        <Paper className={classes.computerInfo}>
                            <ComputerInformation
                                assetId={asset.id}
                                computerId={asset.connectedComputerId}
                            />
                        </Paper>
                    </ExpansionPanelDetails>
                ) : (
                    <div className={classes.noContent}>
                        <BeatLoader
                            size={10}
                            color={"#3f51b5"}
                        />
                    </div>
                )}
                <Divider/>
                <ExpansionPanelActions className={classes.expansionPanelActions}>
                    <DeleteAssetDialog
                        assetId={asset.id}
                        assetName={asset.name}
                        assetViewCallback={this.handleDeleteAsset}
                    />
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    }
}

AssetView.propTypes = {
    classes: PropTypes.object.isRequired,
    asset: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        attributes: PropTypes.array.isRequired,
        relatedAssetsIds: PropTypes.array.isRequired,
        connectedComputerId: PropTypes.string
    }).isRequired,
    open: PropTypes.bool.isRequired,
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            category: PropTypes.object,
            subCategories: PropTypes.array
        })
    ),
    assetsUpdateCallback: PropTypes.func.isRequired,
    assetsRedirectCallback: PropTypes.func.isRequired,
    assetsDeleteCallback: PropTypes.func.isRequired
};

export default withStyles(styles)(AssetView)