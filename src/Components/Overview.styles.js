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
    sectionTitle: {
        float: "left",
        paddingRight: 25,
    },
    categoriesTreeSection: {
        float: 'left',
        height: "100%",
        width: "100%",
    },
    filtersSection: {
        float: 'center',
        height: "100%",
        width: "100%",
    },
});

export default styles
