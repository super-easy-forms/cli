const {Command, flags} = require('@oclif/command')
const SEF = require('super-easy-forms')

class InitCommand extends Command {
  async run() {
    const {args} = this.parse(InitCommand)
    SEF.InitForm(args.name, function(err, data){
      if(err) console.error(err)
      else{
        console.log('created a config file for your form')
      }
    })
  }
}

InitCommand.description = `Creates a config file with empty values for your form.`;

InitCommand.args = [
  {
    name: 'name',
    required: true,
    description: 'name of the form you want to initialize',
  }
]

module.exports = InitCommand
