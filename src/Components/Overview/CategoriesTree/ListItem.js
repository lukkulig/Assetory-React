import React from "react";
import {AddCircleOutline, RemoveCircleOutline} from "@material-ui/icons"
import {ListGroupItem} from "reactstrap";

const DEFAULT_PADDING = 10;
const LEVEL_SPACE = 15;
const ICON_SIZE = 23;
const ToggleIcon = ({on}) =>
    on ? <RemoveCircleOutline style={{marginRight: 3}} fontSize='small'/> :
        <AddCircleOutline style={{marginRight: 3}} fontSize='small'/>;

const ListItem = ({
                      level = 0,
                      hasNodes,
                      isOpen,
                      label,
                      searchTerm,
                      openNodes,
                      toggleNode,
                      matchSearch,
                      focused,
                      ...props
                  }) => (
    <ListGroupItem {...props} action
                   style={{
                       paddingLeft: DEFAULT_PADDING + level * LEVEL_SPACE + (!hasNodes ? ICON_SIZE : 0),
                       cursor: 'pointer',
                       zIndex: focused ? 999 : 'unset',
                       position: 'relative',
                       textAlign: 'left',
                       paddingTop: 4,
                       paddingBottom: 5,
                   }}
    >
        {hasNodes && (
            <div style={{display: 'inline-block'}}
                 onClick={e => {
                     hasNodes && toggleNode && toggleNode();
                     e.stopPropagation();
                 }}
            >
                <ToggleIcon on={isOpen}/>
            </div>
        )}
        {label}
    </ListGroupItem>
);

export default ListItem