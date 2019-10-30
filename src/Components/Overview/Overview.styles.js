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
        height: '100%'
    },
    sideBarPaper: {
        float: 'left',
        height: "100%",
        width: "100%",
        display: 'grid',
        gridTemplateRows: 'fit-content(100%) auto',
        gridTemplateAreas: `'categoryTree'
                            'filters'`,
        marginRight: theme.spacing(1)
    },
    categoryTreeSection: {
        gridArea: 'categoryTree',
        overflow: 'auto',
        height: "100%",
    },
    filtersSection: {
        gridArea: 'filters',
        marginTop: theme.spacing(3),
        paddingBottom: 25
    },
    assetsSection: {
        gridArea: 'main',
        marginLeft: theme.spacing(1),
    },
    assetsPaper: {
        float: 'left',
        height: "100%",
        width: "100%",
    }
});

export default styles
