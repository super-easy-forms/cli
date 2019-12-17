const {Command, flags} = require('@oclif/command')
const SEF = require('super-easy-forms')
const {cli} = require('cli-ux');

class SubmissionsCommand extends Command {
  async run() {
    const {flags, args} = this.parse(SubmissionsCommand)
    if(flags.list){
      cli.action.start('Fetching your form submissions')
      SEF.GetSubmissions(args.name, function(err, data){
        if(err) {
          console.error(err)
          cli.action.stop('Error')
        }
        else{
          for(let i = 0; i < data.length; i++){
            console.log(`${i}.`)
            let item = data[i];
            Object.keys(item).map(function(key) {
              let val = item[key]
              console.log(`${key}: ${val["S"]}`)
            }) 
          }
          cli.action.stop()
        }
      })
    }
    else if(flags.export){
      cli.action.start('Exporting your form submissions')
      SEF.ExportSubmissions(args.name, flags.format, function(err, data){
        if(err) {
          console.error(err)
          cli.action.stop('Error')
        }
        else{
          cli.action.stop()
        }
      })
    }
  }
}

SubmissionsCommand.args = [
  {
    name: 'name',
    required: true,
    description: 'name of the form',
  }
]
SubmissionsCommand.flags = {
  list: flags.boolean({
    char: 'l',
    description: 'print all submissions for the form to stdout',
    exclusive: ['export'],
  }),
  export: flags.boolean({
    char: 'e',
    description: 'Exports all submissions for the form to its folder',
    exclusive: ['list'],         
  }),
  format: flags.string({
    char: 'f',                    
    description: 'Desired format csv|json',
    options: ['csv', 'json'], 
    required: false,
    dependsOn: ['export']         
  }), 
}

SubmissionsCommand.description = `export or list all of the suibmissions you have had to date for a selected form`

module.exports = SubmissionsCommand
