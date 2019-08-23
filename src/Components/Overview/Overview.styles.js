const styles = theme => ({
    content: {
        display: 'grid',
        gridTemplateColumns: '20% 80%',
        gridTemplateRows: 'calc(100vh - 115px)',
        gridTemplateAreas: `'sidebar main'`,
        padding: theme.spacing(3),
    },
    sideBarSection: {
        gridArea: 'sidebar',
        marginRight: theme.spacing(1)
    },
    assetsSection: {
        gridArea: 'main',
        marginLeft: theme.spacing(1),
    },
    categoryTreeSection: {},
    filtersSection: {
        marginTop: theme.spacing(3),
    },
    paper: {
        float: 'left',
        height: "100%",
        width: "100%",
    },
});

export default styles
