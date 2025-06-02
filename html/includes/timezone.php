<?php
$timezones = [
  [
    'value' => 'Pacific/Midway',
    'label' => '(UTC-11:00) Midway',
    'countries' => ['United States'],
    'cities' => ['Midway Atoll']
  ],
  // ... other timezones ...
];

function populateTimezoneSelect($selectName, $selected = null) {
  global $timezones;
  foreach ($timezones as $tz) {
    $selectedAttr = ($selected === $tz['value']) ? 'selected' : '';
    echo "<option value='{$tz['value']}' $selectedAttr>{$tz['label']}</option>";
  }
}
?>