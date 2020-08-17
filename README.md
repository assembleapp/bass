* go see [brew.sh](brew.sh)
* brew install ruby node yarn
* ruby pull.rb /sompleace/on/local/machine/ 1 1
* brew cask install visual-studio-code
* gem install sinatra sinatra-contrib
* ruby go.rb &
* yarn
* yarn start &
* code grammar/0x01

## Archival search

[books](https://uscode.house.gov/table3/table3statutesatlarge.htm)

```
  1    2    3    4    5                            9   10
 11   12   13   14   15   16        17   18       19   20
 21   22   23   24   25   26        27   28       29   30
 31   32   33   34   35   36        37   38       39   40
 41   42   43   44   45   46        47   48       49   50
 51   52   53   54   55   56        57   58       59   60
 61   62   63   64   65   66        67   68  68A  69   70 70A
 71   72   73   74   75   76  76A   77   78       79   80
 81   82   83   84   85   86        87   88       89   90
 91   92   93   94   95   96        97   98       99  100
101  102  103  104  105  106       107  108      109  110
111  112  113  114  115  116       117  118      119  120
121  122  123  124  125  126       127  128      129  130
131  132  133
```

`read.rb`:

```ruby
pending_images =
  Dir.
  glob("records.original.images/*").
  map {|f| File.basename(f) } -
  Dir.
  glob("records.original.phrases/*").
  map {|f| File.basename(f) }.
  map {|f| f.sub(/\.txt$/, '')}

pending_images.sort.each do |pending_image|
  puts pending_image
  `tesseract records.original.images/#{pending_image} records.original.phrases/#{pending_image}`
end
```

`display.rb`

```ruby
images = Dir.
  glob("records.original.images/*").
  map {|f| File.basename(f) }

phrases = Dir.
  glob("records.original.phrases/*").
  map {|f| File.basename(f) }.
  map {|f| f.sub(/\.txt$/, '')}

pending = images - phrases

records = images + phrases
names = records.map { |v| File.basename(v).match(/(\d+)-\d+/)[1] }.uniq.sort

puts names.map { |name|
  pages = records.map { |v| match = File.basename(v).match(/#{name}-(\d+)/); match ? match[1] : "0" }.uniq.sort
  "#{name}\t: #{pages.last.to_i.times.with_index.map { |i| (pages.include?('%03s' % i) || pages.include?('%04s' % i)) ? 'X' : '.'}.join}\n\n"
}
```

progress:

```bash
> watch 'echo phrases:; ls records.original.phrases/ | wc -l; echo images:; ls records.original.images/ | wc -l'
```
