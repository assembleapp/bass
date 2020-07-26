book = ARGV[0].to_i
page = ARGV[1].to_i


while true
  name = "records.original.images/#{'%03d' % book}-#{'%03d' % page}.png"
  `curl https://uscode.house.gov/images/stat/#{book}/#{page}.png > #{name} 2> /dev/null`

  contents = File.read(name)
  success = contents.length > 0

  if success
    puts "#{name}: Success"
    page += 1

  elsif page < 5
    puts "#{name}: No book"
    `rm #{name}`
    page += 1

  else
    puts "#{name}: book end"
    `rm #{name}`

    book += 1
    page = 1
  end
end
