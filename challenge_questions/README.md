### Test 1 - "Improve UI/UX with a back button.":

##### Story:
As a user, I would like to be able to more clearly navigate back to the main list of flags from within a flag details page.

##### Requirements:
- Ability to navigate back to the main ("current") list of feature flags from within a flag details page.
- This should be a simple button on the top of the feature flag detail page where someone would expect "breadcrumbs" to be.
    - The button should be twice as long as it is tall
    - Respond accordingly to different size windows/mobile
    - Be the same teal color used throughout the rest of the application.
    - Have a small radius on the corners of the button to look nice.
    - The text should be white and read "Main List"

##### Acceptance Criteria:
I should be able to easily navigate back to the main ("current") list from a flag detail page via a button.

##### Definition of Done:
Being able to navigate to the flag detail page, make any necessary changes, and use the button of prescribed design to return back to he "current" list of flags.


### Test 2 - "Streamline flag creation process":

##### Story:
As a user, I would like to be able to input a flag description and whether or not the flag is long term, during the flag creation process via the UI.

##### Requirements:
- Ability to populate the description within the creation modal during flag creation.
- Ability to select if the flag is long term or not during the creation modal.

This should utilize the existing API POST request and payload parameters as found in the documentation.

##### Acceptance Criteria:
I should be able to input the description and if the flag is long term on the creation modal.

##### Definition of Done:
I can input the description via a text box on the flag creation modal and select if the flag is long term or not using the same type and style of toggle selector as found in other parts of the UI.

The flag creation long term toggle should be defaulted to NOT long term.

The description should be blank, and allow blank submittals, but the text box should include a placeholder that says “An optional description can be filled in here.”

### Test 3 - "Simplify removed flag views":

##### Story:
As a user, I would like to see both deleted AND deployed flags in the same view, but still be able to differentiate between them.

##### Requirements:
- Combine the “Deleted” and “Deployed” tabs into a single tab called “Deleted/Deployed”
- Notate the deleted flags by changing the color of the font to RED.
- Notate the deployed flags by changing the color of the font to GREEN.

This should utilize the existing API GET requests as found in the documentation.

##### Acceptance Criteria:
I should be view both the deleted and deployed flags in the same tab, differentiated by color.

##### Definition of Done:
I can navigate to the “Deleted/Deployed” tab and quickly identify which flags were deleted because of their red color and which ones were deployed because of the green color. The “4th” tab should no longer be visible or accessible.

### Test 4 - "Improving flag management":

##### Story:
As a user, I would like to be able to sort, filter, and perform bulk actions on feature flags.

##### Requirements:
- I would like the ability to filter flags by:
    - Their status (active or not)
    - Their status (enabled or not)
- I would like the ability to sort the list either by name or the date of the most recent action taken
- I would like to be able to bulk activate or deactivate all or a subset of flags sorted by “enabled” and bulk enable or disable all or a subset of flags sorted by “enabled/disabled”

This should utilize the existing API GET/PUT requests as found in the documentation.

##### Acceptance Criteria:
I should be able to sort and filter the list of flags, as well as apply some bulk actions to them.

##### Definition of Done:
I can look at the list of feature flags and sort them either by name (alphabetically in either direction) or by last activity date (oldest or newest). I should also be able to filter the flags by either their active or enabled status to only show a subset of flags. I should then be able to refine that list and apply a bulk update of either activate/deactivate/enable/disable, depending on the filtered list/current state of the flag.


### Test 5 - "Just for fun bonus test":

This is a stretch test and only considered as “bonus points”

Fix any or all of the existing “Known bugs” listed in the documentation.


### Submission

Document your fixes concisely, but thoroughly, in the description of the pull request.

For each test, please create a pull request for each test with the name "test-[1-5]-some-concise-title"

There should be at least 4 pull requests if each "ticket" was completed, 5+ if any known bugs were fixed.



