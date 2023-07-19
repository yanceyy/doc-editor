import {
    Button,
    Editable,
    EditableInput,
    EditablePreview,
    FileHeader,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "ui-components";

import { ToolBar } from "../ToolBar";

export function Header() {
    return (
        <FileHeader
            titleRow={
                <Editable defaultValue="Test doc">
                    <EditablePreview />
                    <EditableInput />
                </Editable>
            }
            menuRow={
                <Menu size="small">
                    <MenuButton as={Button}>Actions</MenuButton>
                    <MenuList>
                        <MenuItem>Download</MenuItem>
                        <MenuItem>Create a Copy</MenuItem>
                        <MenuItem>Mark as Draft</MenuItem>
                        <MenuItem>Delete</MenuItem>
                        <MenuItem>Attend a Workshop</MenuItem>
                    </MenuList>
                </Menu>
            }
            actionRow={<ToolBar />}
        />
    );
}
