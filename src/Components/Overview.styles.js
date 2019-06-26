const styles = theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        float: 'center',
        textAlign: 'center',
        padding: theme.spacing(3),
    },
    categoriesTreeSection: {
        float: 'left',
        height: "100%",
        width: "100%",
        margin: theme.spacing(1)
    },
    filtersSection: {
        float: 'center',
        height: "100%",
        width: "100%",
        margin: theme.spacing(1)
    },
});

export default styles
