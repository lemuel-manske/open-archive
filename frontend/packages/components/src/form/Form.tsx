import { Button } from "../button/Button";

import { Combobox } from "../combobox/Combobox";

import { Checkbox } from "../checkbox/Checkbox";

import { Field } from "../field/Field";

import { Fieldset } from "../fieldset/Fieldset";

import { Input } from "../input/Input";

import { Label } from "../label/Label";

import { RadioGroup } from "../radio-group/RadioGroup";

import { Textarea } from "../textarea/Textarea";

import type { FormProps } from "./types";

import { useForm } from "./useForm";

function Form(props: FormProps) {
  const formProps = useForm(props);

  return <form {...formProps} />;
}

Form.Input = Input;

Form.Textarea = Textarea;

Form.Combobox = Combobox;

Form.Label = Label;

Form.Button = Button;

Form.Field = Field;

Form.Checkbox = Checkbox;

Form.RadioGroup = RadioGroup;

Form.Fieldset = Fieldset;

export { Form };
