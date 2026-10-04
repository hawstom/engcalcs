# Help manual source

Tip text removed from the Looped Network page on Tom's 2026-10-04 tip verdicts, kept as material for a searchable help manual (his note: "Almost all the deletes could be turned into a searchable help manual"). Grouped by where each tip used to show. Not rendered anywhere.

## Bottom table pane: sortarrow field

- Reverse the sort (`lpn_pane_sortarrow_tip`)

## File > Recent projects list item

- Open {file} again from the same location on your computer. (`lpn_recent_tip`)

## File menu item: open field

- Open a project file saved from this page. (`lpn_file_open_tip`)

## File menu item: save field

- Saves to the connected file. (`lpn_file_save_tip`)

## File menu item: saveas field

- Choose a file to save to. This project connects to that file, and Save writes to it from then on. (`lpn_file_saveas_tip`)

## Graphs > Profile item

- Draw the ground and the hydraulic grade line along a path through the network. (`lpn_profile_tip`)

## Graphs panel: add field

- Put everything now selected on the map onto the graph. (`lpn_ts_add_tip`)

## Graphs panel: group field

- Whether the graph shows junctions or pipes. (`lpn_freq_group_tip`)
- Whether the graph shows nodes or links. (`lpn_ts_group_tip`)

## Graphs panel: quantity field

- Which value to graph. (`lpn_freq_quantity_tip`)
- Which value to graph against time. (`lpn_ts_quantity_tip`)

## Libraries box or Properties box curve/type selector: curve note field

- What this curve is, in your own words. (`lpn_library_curve_note_tip`)

## Libraries box or Properties box curve/type selector: curve type field

- What this curve describes (`lpn_library_curve_type_tip`)

## Map > Go to latitude and longitude box

- Pan the map to coordinates entered as lat lon or lat,lon. (`lpn_goto_tip`)

## Map > Labels (shown when a label is dragged)

- You can drag a label to move it. The label highlights briefly to alert you that it was moved. Double-click a label to send it back to its automatic position. (`lpn_tip_labels_draggable`)

## Menu bar > Graphs (hover)

- Plot a profile along a path, a time series at one element, the frequency distribution of results, a contour plot on the map, or the flow balance over time. (`lpn_graphs_menu_tip`)

## Menu bar > Libraries (hover)

- Manage the demand patterns, pump curves and control rules for this project. (`lpn_library_menu_tip`)

## Menu bar > Reports (hover)

- Reports on pumping energy cost, scenario comparison, the EPANET solver report, calibration against measured data, and, after an extended period simulation, the status report and the full report. (`lpn_reports_menu_tip`)

## Menu bar > Reports > Pump energy item

- What share of the run each pump was on, what power it drew and what it cost over the last extended period simulation. (`lpn_energy_menu_tip`)

## Properties box > Customer: meter count field

- How many identical services this one customer stands for, so that forty-two single-family connections along one main can be one symbol in one place. The total below is the demand above times this count. (`lpn_field_meter_count_tip`)

## Properties box > Customer: meter demand field

- What each service at this customer requires. Find and replace can leverage the distinction between blank and 0. (`lpn_field_meter_demand_tip`)

## Properties box > Customer: meter pattern field

- How this customer’s demand rises and falls through the run. It multiplies the total demand, so it acts on every service this customer stands for. Leave it at No pattern to follow the project’s Default demand pattern. (`lpn_field_meter_pattern_tip`)

## Properties box: demand add field

- Add another demand category at this junction, with its own base demand, pattern and description. The categories add up. (`lpn_demand_add_tip`)

## Properties box: demand category field

- Name or description of this demand category. (`lpn_field_demand_category_tip`)

## Properties box: demand pattern field

- How this junction’s demand rises and falls through the run. Leave it at No pattern and the junction follows the project’s Default demand pattern instead. (`lpn_field_demand_pattern_tip`)

## Properties box: desc field

- For your own use, such as a street corner or what a pipe is made of. It is carried into and out of the EPANET file, where it sits at the end of the part's own row. No calculation reads it. A line break becomes a space, because the file has nowhere to put one. (`lpn_field_desc_tip`)

## Properties box: elev field

- Ground or pipe level at this node. Measure it from any zero you like, as long as every node uses the same one. (`lpn_field_elev_tip`)

## Properties box: km field

- Loss from the bends, valves, and fittings on this pipe, counted as a multiple of the velocity head. Use 0 for a plain straight pipe. (`lpn_field_km_tip`)

## Properties box: length field

- Length of the pipe. With Auto turned on the length is measured from what you drew. Turn Auto off to type a length that differs from the drawing. (`lpn_field_length_tip`)

## Reports dialogs: col n field

- Number of observations: the measurements at this location that were compared. (`lpn_calib_col_n_tip`)

## Settings dialog: decimals field

- Decimal places shown for this label (`lpn_labels_decimals_tip`)

## Settings dialog: leader snap field

- Snap angle used when you drag a label away from its asset. (`lpn_settings_leader_snap_tip`)

## Settings dialog: prefix field

- Text added before this property on map labels (`lpn_labels_prefix_tip`)

## Settings dialog: specific gravity field

- The weight of the fluid compared with water. It changes the pressures a gauge would read, not the flows. (`lpn_settings_specific_gravity_tip`)

## Settings dialog: suffix field

- Text added after this property on map labels (`lpn_labels_suffix_tip`)

## Toolbar > Add junction button (hover)

- Click the map to add a junction: a point where pipes meet or where water is used. (`lpn_tool_add_junction_tip`)

## Toolbar > Add pipe button (hover)

- Click one node and then another to draw a pipe between them. (`lpn_tool_add_pipe_tip`)

## Toolbar > Add pump button (hover)

- Click one node and then another to put a pump between them. (`lpn_tool_add_pump_tip`)

## Toolbar > Add reservoir button (hover)

- Click the map to add a reservoir: an infinite source with a fixed water level. (`lpn_tool_add_reservoir_tip`)

## Toolbar > Add tank button (hover)

- Click the map to add a tank: storage whose water level rises and falls as it fills and empties. (`lpn_tool_add_tank_tip`)

## Toolbar > Add text button (hover)

- Click the map to write a note on the drawing. (`lpn_tool_add_text_tip`)

## Toolbar > Add valve button (hover)

- Click one node and then another to put a valve between them. (`lpn_tool_add_valve_tip`)

## Toolbar > Color by button (hover)

- Color the network by one quantity, so a large map can be read at a glance. Pressure and velocity are the two that usually matter. (`lpn_tool_color_tip`)

## Toolbar > Delete button (hover)

- Click anything on the map to remove it. (`lpn_tool_delete_tip`)

## Toolbar > Settings button (hover)

- Open the settings for this project. (`lpn_tool_settings_tip`)
