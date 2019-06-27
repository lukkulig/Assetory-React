const styles = theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        display: 'flex',
        height: "85vh",
        float: 'center',
        textAlign: 'center',
        padding: theme.spacing(3),
    },
    categoriesTreeSection: {
        float: 'left',
        flexGrow: 1,
        margin: theme.spacing(1)
    },
    assetsSection: {
        float: 'left',
        flexGrow: 99,
        display: 'flex',
        flexDirection: 'column',
        margin: theme.spacing(1)
    },
    filtersSection: {
        float: 'left',
        flexGrow: '1',
        marginBottom: theme.spacing(2)
    },
    assetsViewSection: {
        float: 'left',
        clear: 'left',
        flexGrow: '99',
    },
    paper: {
        float: 'left',
        height: "100%",
        width: "100%",
        margin: theme.spacing(1)
    },
});

export default styles
