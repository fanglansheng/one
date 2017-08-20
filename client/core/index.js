import * as constants from "./constants";
import * as action from "./defaultActions";
import * as ReducerFactory from "./reducerFactory";

import withEditable from "./withEditable";
import OpenHourTable from "./components/OpenHourTable";
import SingleSelectButton from "./components/SingleSelectButton";
import TextLabel from "./components/TextLabel";
import NumberLabel from "./components/NumberLabel";
import VisitTypeButton from "./components/VisitTypeButton";

export default {
  constants,
  action,
  ReducerFactory,
  EditableTextLabel: withEditable(TextLabel),
  EditableNumberLabel: withEditable(NumberLabel),
  OpenHourTable,
  SingleSelectButton,
  VisitTypeButton
};
