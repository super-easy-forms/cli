const {Command} = require('@oclif/command')
const SEF = require('super-easy-forms')
const {cli} = require('cli-ux');

class VariableCommand extends Command {
  async run() {
    const {args} = this.parse(VariableCommand)
    cli.action.start('Adding your variable')
    SEF.AddConfigVariable(args.name, args.variable, args.value, function(err, data){
      if(data){
        cli.action.stop();
      }
      else cli.action.stop('Error')
    })
  } 
}

VariableCommand.args = [
  {
    name: 'name',
    required: true,
    description: 'name of the form',
  },
  {
    name: 'variable',
    required: true,
    description: 'name of the variable',
  },
  {
    name: 'value',
    required: true,
    description: 'value of the variable',
  },
]

VariableCommand.description = `Builds an html form`

module.exports = VariableCommand