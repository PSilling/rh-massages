Components
----------

**src/App.js**

### 1. App

Main application component. Contains the Router, NotificationContainer and Navbar.   




-----
**src/components/buttons/AssignButton.js**

### 1. AssignButton

A button used for Massage assignment. Contains a ConfirmationModal to confirm
the assignment.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
onAssign|func|yes||function to be called on button click
disabled|bool|no|false|whether the button should be disabled
-----
**src/components/buttons/BatchButton.js**

### 1. BatchButton

A default styled button component with a given label. Used primarily for
batch operation buttons.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
onClick|func|yes||function to be called on button click
label|string|no||button label
disabled|bool|no|false|whether the button should be disabled
-----
**src/components/buttons/BatchDeleteButton.js**

### 1. BatchDeleteButton

A button used for batch Massage deletion. Contains a ConfirmationModal to confirm
the action.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
onDelete|func|yes||function to be called on action confirmation
label|string|no||button label
disabled|bool|no|false|whether the button should be disabled
-----
**src/components/buttons/CancelButton.js**

### 1. CancelButton

A button used for Massage cancellation. Contains a ConfirmationModal to confirm
the action.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
onCancel|func|yes||function to be called on action confirmation
disabled|bool|no|false|whether the button should be disabled
-----
**src/components/buttons/ForceCancelButton.js**

### 1. ForceCancelButton

A button used for administrator forced Massage cancellation. Contains a ConfirmationModal
to confirm the action.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
onCancel|func|yes||function to be called on button click
-----
**src/components/buttons/ModalActions.js**

### 1. ModalActions

Footer buttons for Modal dialogs. Children components can be given to add more
case specific elements.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
primaryLabel|string|yes|&lt;See the source code&gt;|primary button label
onProceed|func|yes||callback function triggered on primary button click
onClose|func|yes||callback function triggered on close button click
autoFocus|bool|no|false|whether the primary button should be automatically focused
-----
**src/components/iconbuttons/AddButton.js**

### 1. AddButton

Icon only button used for element addition.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
onAdd|func|yes||function to be called on button click
-----
**src/components/iconbuttons/CalendarButton.js**

### 1. CalendarButton

Icon only button that handles event addition to Google Calendar.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
onAdd|func|yes||function to be called on action confirmation
disabled|bool|no|false|whether the button should be disabled
-----
**src/components/iconbuttons/DeleteButton.js**

### 1. DeleteButton

Icon only button used for element deletion. Contains a ConfirmationModal to confirm
the action.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
onDelete|func|yes||function to be called on button click
-----
**src/components/iconbuttons/EditButton.js**

### 1. EditButton

Icon only button used for element editation.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
onEdit|func|yes||function to be called on button click
-----
**src/components/links/LangLink.js**

### 1. LangLink

Link for language switching.   




-----
**src/components/links/LogoutLink.js**

### 1. LogoutLink

Link that redirects to Keycloak logout and the application after server logout.   




-----
**src/components/links/ProfileLink.js**

### 1. ProfileLink

Link that redirects to Keycloak account management.   




-----
**src/components/modals/ConfirmationModal.js**

### 1. ConfirmationModal

Modal with a simple action confirmation message and ModalActions.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
message|string|yes||message in the Modal
onConfirm|func|yes||callback function triggered on primary button click
onClose|func|yes||callback function triggered on Modal close
-----
**src/components/modals/FacilityModal.js**

### 1. FacilityModal

Input Modal for Facility management. Allows the change of Facility name.
Based on given values can be used for both creating and editing of Facilities.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
active|bool|yes||whether the dialog should be shown
facility|object|no||Facility to be possibly edited or null when adding
getCallback|func|yes||callback function for Facility list update
onToggle|func|yes||function called on modal toggle
-----
**src/components/modals/MassageBatchAddModal.js**

### 1. MassageBatchAddModal

Input Modal for creating multiple rules of Massages at once.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
active|bool|no||whether the dialog should be shown
facilityId|number|yes||ID of the selected Facility
masseuses|arrayOf|no||unique Massage masseuses of the given Facility
getCallback|func|yes||callback function for Massage list update
onToggle|func|yes||function called on modal toggle
-----
**src/components/modals/MassageBatchEditModal.js**

### 1. MassageBatchEditModal

Input Modal for editing multiple rules of Massages at once.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
active|bool|no||whether the dialog should be shown
disabled|bool|no||whether the trigger button should be disabled or not
massages|arrayOf|yes||Massages to be copied
masseuses|arrayOf|no||unique Massage masseuses of the given Facility
getCallback|func|yes||callback function for Massage list update
onToggle|func|yes||function called on modal toggle
-----
**src/components/modals/MassageCopyModal.js**

### 1. MassageCopyModal

Modal dialog that enables generation of Massage copies at a selected time interval.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
active|bool|no||whether the dialog should be shown
disabled|bool|no||whether the trigger button should be disabled or not
massages|arrayOf|yes||Massages to be copied
getCallback|func|yes||callback function for Massage list update
onToggle|func|yes||function called on modal toggle
-----
**src/components/modals/MassageModal.js**

### 1. MassageModal

Input Modal for Massage management. Allows the change of Massage date, duration and masseuse.
Based on given values can be used for both creating and editing of Massages.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
active|bool|yes||whether the dialog should be shown
massage|object|no||Massage to be possibly edited or null when adding
facilityId|number|no||ID of the selected Facility
masseuses|arrayOf|no||unique Massage masseuses of the given Facility
getCallback|func|yes||callback function for Massage list update
onToggle|func|yes||function called on modal toggle
-----
**src/components/navs/Page.js**

### 1. Page

A simgle number page for the Pager component.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
active|bool|no|false|whether the page is the active one
number|number|no||page number
onClick|func|no||function called on page click
-----
**src/components/navs/Pager.js**

### 1. Pager

Pagination stack for given Massages.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
page|number|no||current page number
perPage|number|no||number of Massages shown per each page
pages|number|no||total number of pages to show
onPageChange|func|no||function called on page change
onPerPageChange|func|no||function called on per page count change
-----
**src/components/navs/Tab.js**

### 1. Tab

Single labeled Tab component used in navigation tabbing.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
active|bool|no|false|whether the tab is the active one
label|string|no||tab title label
onClick|func|no||function called on tab click
-----
**src/components/panels/MyMassagePanel.js**

### 1. MassagePanel

Massage information panel for My Massages view.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
type|string|yes|&lt;See the source code&gt;|type of the Bootstrap panel
massage|object|yes||Massage to be printed inside the panel
getCallback|func|no||update callback function called on Massage cancellation
disabled|bool|no|true|whether the removal button should be hidden or not
-----
**src/components/rows/ArchiveMassageRow.js**

### 1. ArchiveMassageRow

Massage information row for Massages Archive view.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
massage|object|yes||the Massage for this row
search|string|no||search string to be highlighted
onDelete|func|yes||function called on Massage delete
-----
**src/components/rows/FacilityRow.js**

### 1. FacilityRow

Facility information row for Facilities view.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
facility|object|yes||the facility for this row
onEdit|func|yes||function called on Facility edit
onDelete|func|yes||function called on Facility delete
-----
**src/components/rows/MassageRow.js**

### 1. MassageRow

Massage information row for Massages view.   




Property | Type | Required | Default value | Description
:--- | :--- | :--- | :--- | :---
massage|object|yes||the Massage for this row
assignDisabled|bool|no||whether assingment button should be disabled
checked|bool|no||whether the checkbox is checked
search|string|no||search string to be highlighted
onCheck|func|yes||function called on checkbox value change
onAssign|func|yes||function called on Massage assignment
onEventAssign|func|yes||function called on Massage assignment with calendar event
onCancel|func|yes||function called on Massage cancellation
onEdit|func|yes||function called on Massage edit
onDelete|func|yes||function called on Massage delete
-----
**src/views/Facilities.js**

### 1. Facilities

Main view table component for Facility management. Viewable only for administators.   




-----
**src/views/Massages.js**

### 1. Massages

Main view table component for Massage management. Normal users can only view,
assign and cancel Massages. Supports batch CRUD operations.   




-----
**src/views/MassagesArchive.js**

### 1. MassagesArchive

Main view table component for Massage Archive management. Viewable only for administators.
For archived Massages only their removal is supported.   




-----
**src/views/MyMassages.js**

### 1. MyMassages

Main view component for My Massages management. Uses Massage information panels
for better user experience.   




-----

<sub>This document was generated by the <a href="https://github.com/marborkowski/react-doc-generator" target="_blank">**React DOC Generator v1.2.5**</a>.</sub>
