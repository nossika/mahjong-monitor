import * as inquirer from 'inquirer';

export interface SelectOptions {
  value: string;
  label: string;
}

export const select = async (
  title: string,
  options: SelectOptions[],
  defaultValue?: string,
): Promise<string> => {
  const { value } = await inquirer.prompt([{
    type: 'list',
    message: title,
    name: 'value',
    choices: options.map(o => ({
      name: o.label,
      value: o.value,
    })),
    default: defaultValue,
  }]);

  return value;
};