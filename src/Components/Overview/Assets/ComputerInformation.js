import * as PropTypes from "prop-types";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup, TextField,
    withStyles
} from "@material-ui/core";
import React from 'react';
import api from "../../../api";
import styles from "../Overview.styles";
import TreeMenu from 'react-simple-tree-menu';

class ComputerInformation extends React.Component {

    state = {
        computerChoiceDialogOpen: false,
        chosenComputer: undefined,
        registeredComputers: [],
        report: undefined,
        reportDate: undefined,
    };

    mapReportToData(report) {
        if (report === undefined) {
            return [];
        }
        let systemData = {
            key: 'System',
            label: 'System',
            nodes: this.mapToData(report.system),
        };
        let hardwareData = {
            key: 'Hardware',
            label: 'Hardware',
            nodes: this.mapToData(report.hardware),
        };
        let softwareData = {
            key: 'Software',
            label: 'Software',
            nodes: this.mapSoftwareToData(report.software),
        };
        return [systemData, hardwareData, softwareData]
    };

    mapToData(dataMap) {
        return Object.keys(dataMap).map(parameter => {
            return {
                key: parameter,
                label: parameter + ": " + dataMap[parameter],
            }
        });
    }

    mapToFormControlLabel(computerName) {
        return (
            <FormControlLabel control={<Radio/>} label={computerName} value={computerName}/>
        )
    }

    mapSoftwareToData(softwareReport) {
        return Object.keys(softwareReport).map(record => {
            return {
                key: record,
                label: record,
                nodes: this.mapSingleSoftwareRecordToData(softwareReport[record]),
            }
        });
    }

    mapSingleSoftwareRecordToData(records) {
        return records.map(record => {
            return {
                key: record.name + record.version + record.installDate,
                label: record.name,
                nodes: [{
                    key: "Version" + record.name + record.version + record.installDate,
                    label: "Version: " + record.version
                },
                    {
                        key: "InstallDate" + record.name + record.version + record.installDate,
                        label: "Install date: " + record.installDate,
                    }]
            };
        })
    }

    handleConnectButton = () => {
        api.fetch(
            api.endpoints.getRegisteredComputers(),
            (response) => {
                this.setState({
                    registeredComputers: response,
                    computerChoiceDialogOpen: true,
                });
            }
        );
    };

    handleComputerChoiceChange = (event) => {
        this.setState({
            chosenComputer: event.target.value,
        });
    };

    handleConfirmConnectionButton = () => {
        api.fetch(
            api.endpoints.registerComputer(this.props.assetId, this.state.chosenComputer),
            (response) => {
                this.setState({
                    computerChoiceDialogOpen: false,
                    chosenComputer: undefined,
                })
            }
        )
    };

    handleReportDateChange = (event) => {
        this.setState({
            reportDate: event.target.value,
        }, () => {
            this.getReport();
        })
    };

    getReport = () => {
        api.fetch(
            api.endpoints.getReportByComputerIdAndDate(this.props.computerId.slice(1, -1), this.state.reportDate),
            (response) => {
                this.setState({
                    report: response,
                })
            }
        ).catch((error) => {
            console.log("Report not found");
            this.setState({
                report: undefined,
            })
        })
    };

    render() {
        const {classes} = this.props;
        if (this.props.computerId === undefined || this.props.computerId === null) {
            return (
                <div>
                    <React.Fragment>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleConnectButton}
                        >
                            Connect with computer
                        </Button>
                        <Dialog
                            open={this.state.computerChoiceDialogOpen}
                        >
                            <DialogTitle id="choose-computer">Choose computer to connect</DialogTitle>
                            <DialogContent>
                                <form className={classes.form} noValidate>
                                    <FormControl>
                                        <RadioGroup name="computers-choices" value={this.state.chosenComputer}
                                                    onChange={this.handleComputerChoiceChange}>
                                            {this.state.registeredComputers.map(name => this.mapToFormControlLabel(name))}
                                        </RadioGroup>
                                    </FormControl>
                                </form>
                            </DialogContent>
                            <DialogActions>
                                <Button color="default"
                                        onClick={() => this.setState({computerChoiceDialogOpen: false})}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={this.handleConfirmConnectionButton}
                                    color="secondary"
                                    disabled={this.state.chosenComputer === undefined}>
                                    Connect
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </React.Fragment>
                </div>
            )
        } else {
            return (
                <div>
                    <TextField
                        id='reportDate'
                        type='date'
                        label='Choose report date'
                        InputLabelProps={{shrink: true}}
                        onChange={this.handleReportDateChange}
                    /> <br/>
                    <TextField
                        id='computerIdentifier'
                        label='Computer identifier'
                        value={this.state.report === undefined ? "" : this.state.report.computerId}
                        readOnly
                        InputLabelProps={{shrink: true}}
                    /><br/>
                    <TextField
                        id='reportDate'
                        label='Report date'
                        value={this.state.report === undefined ? "" : this.state.report.date}
                        readOnly
                        InputLabelProps={{shrink: true}}
                    /><br/>
                    <TextField
                        id='reportTime'
                        label='Report time'
                        value={this.state.report === undefined ? "" : this.state.report.time}
                        readOnly
                        InputLabelProps={{shrink: true}}
                    /><br/>
                    <TreeMenu
                        data={this.mapReportToData(this.state.report)}
                        hasSearch={true}
                    />
                </div>
            )
        }
    }
}

ComputerInformation.propTypes = {
    classes: PropTypes.object.isRequired,
    assetId: PropTypes.string.isRequired,
    computerId: PropTypes.string.isRequired,
};

export default withStyles(styles)(ComputerInformation)