# English strings nobody has ruled on yet

**Generated — never hand-edited.** `php dev/scripts/new_english_keys.php --write`.
`check_all.sh` fails if this file has drifted from `lib/lang.ec.en.php`.

These are the keys that are in `lib/lang.ec.en.php` and in NONE of the other 26 language
files — which is, by construction, every string that has been written and not yet ruled on or
translated. **An absent key is the correct untranslated state**, so this is a worklist and never
a fault.

What to do with it: read the English, and say where it is wrong. A ruling is a sentence in
conversation, not an edit — the wording is Tom's and the editing is AI's. Once the wording is
settled these go into the next translation sprint as a batch.

**24 still to read**, of 24 untranslated keys, of 1895 English keys. A key already marked _Ruled OK_ below needs nothing from you;
the ruling lapses by itself if the wording changes.

**Search for `@@ NEEDS RULING` to jump to every key that still needs you.** It sits
under each unread key, and on the heading of each group that still has one — so the first
hit takes you to a section and the rest walk its keys. A key already ruled does not carry
it, and a fully ruled group says `all ruled` and can be skipped whole.
Write your answer on the flag's own line. Anything is fine; "OK" is enough.

## Questions from the translators  (0, all answered)

Nothing is waiting. Every English-friction finding has a disposition, so `friction_check.php` is clear and a sprint can launch.

## lpn_  (24, 24 to read @@ NEEDS RULING)

- **`lpn_customer_detached`**
  > ⚠ This meter is not connected to a pipe, so its demand is not in the answers. Delete it, or draw a pipe and move the meter onto it.
  @@ NEEDS RULING
- **`lpn_customer_detached_count`**
  > {n} meters are no longer connected to a pipe. Their demand is not in the answers.
  @@ NEEDS RULING
- **`lpn_customer_fixed_head`**
  > ⚠ The near end of that pipe holds a fixed water surface, so this demand changes nothing in the answers.
  @@ NEEDS RULING
- **`lpn_customer_heading`**
  > Customer {id}
  @@ NEEDS RULING
- **`lpn_field_account`**
  > Account number
  @@ NEEDS RULING
- **`lpn_field_account_tip`**
  > Whatever your own records call this service. It is a name on a demand and nothing here looks anything up by it, so it can be an account number, a street address, or a note to yourself. It stays in your project file.
  @@ NEEDS RULING
- **`lpn_field_meter_count`**
  > Services at this meter
  @@ NEEDS RULING
- **`lpn_field_meter_count_tip`**
  > How many identical services this one meter stands for, so that forty-two single-family connections along one main can be one symbol in one place. The total below is the demand above times this count.
  @@ NEEDS RULING
- **`lpn_field_meter_demand`**
  > Demand per service
  @@ NEEDS RULING
- **`lpn_field_meter_demand_tip`**
  > What one service at this meter draws. With the count below at 1, this is the whole of it. An empty box is a meter you have not given a demand to yet, which is not the same as a meter that draws nothing.
  @@ NEEDS RULING
- **`lpn_field_meter_lumped`**
  > Added to junction
  @@ NEEDS RULING
- **`lpn_field_meter_lumped_tip`**
  > The end of that pipe the water reaches this meter through, measured along the pipe. This demand is added to that junction, on top of whatever the junction states itself. Move the meter past the middle of the pipe and it changes to the other end.
  @@ NEEDS RULING
- **`lpn_field_meter_pipe`**
  > Pipe that serves it
  @@ NEEDS RULING
- **`lpn_field_meter_pipe_tip`**
  > The pipe this service connects to. Drag the meter onto another pipe to change it, and drag the circle on the pipe to move where along it the service connects.
  @@ NEEDS RULING
- **`lpn_field_meter_station`**
  > Station along the pipe (%)
  @@ NEEDS RULING
- **`lpn_field_meter_station_tip`**
  > How far along the pipe the service connects, as a percentage of the pipe from its first node to its second. 0 is at one end and 100 is at the other. The circle on the pipe does the same thing with the pointer.
  @@ NEEDS RULING
- **`lpn_field_meter_total`**
  > Total demand
  @@ NEEDS RULING
- **`lpn_field_meter_total_tip`**
  > The demand per service times the number of services. This is the number added to the junction named below.
  @@ NEEDS RULING
- **`lpn_inp_export_flat_customers`**
  > An EPANET file has no customers. The demand of the {n} meters in this project goes into the file as a demand row on the junction each one is added to, and each row is named with its account number. What the file cannot hold is the meter: where it sits, which pipe serves it, where along that pipe the service connects, and how many services one meter stands for. Your own project file keeps all of that.
  @@ NEEDS RULING
- **`lpn_meter_pick_pipe`**
  > Now click the pipe that serves this meter. Press Escape to cancel.
  @@ NEEDS RULING
- **`lpn_mode_add_meter`**
  > Meter: click the pipe that serves this customer, or click open ground and then click its pipe. Escape leaves the tool.
  @@ NEEDS RULING
- **`lpn_pane_tab_customers`**
  > Customers
  @@ NEEDS RULING
- **`lpn_tool_add_meter`**
  > Meter
  @@ NEEDS RULING
- **`lpn_tool_add_meter_tip`**
  > Click the pipe that serves a customer to put a meter on it, or click open ground and then click the pipe. The demand you give the meter is added to the junction at the near end of that pipe.
  @@ NEEDS RULING
