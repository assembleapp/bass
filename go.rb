require "sinatra"
require "sinatra/reloader"

set :bind, "0.0.0.0"

def find_rules(origin)
  Dir.glob("#{origin}/*").sort.sort {|a, b|

    if    File.basename(a) == "source";      -1
    elsif File.basename(b) == "source";      1
    else                              ;      0
    end

  }.map do |rule|

    [
      File.basename(rule),
      File.read(rule).strip
    ]

  end.to_h
end

def build_grammar(place, name, rules)
  File.write(place, <<-END)
module.exports = grammar({
  name: "#{name}",
  rules: {
    #{rules.map { |name, rule| "#{name}: $ => #{rule}" }.join(",\n")}
  }
})
END
end

get "/focus" do
  send_file "./src/volume-page.words/001-0001.png.txt"
end

get "/grammar" do
  send_file "./grammar.js"
end

get "/:grammar/:rule" do
  send_file "./grammar/#{params[:grammar]}/#{params[:rule]}"
end

get "/analysis" do
  halt 200, {'Content-Type' => 'text/plain'}, `tree-sitter parse src/volume-page.words/001-0001.png.txt`
end

get "/corpus" do
  halt 200, {'Content-Type' => 'text/plain'}, `tree-sitter test`
end

post "/:grammar" do
  # File.write(
  #   "./grammar/#{params[:grammar]}/#{params[:rule]}",
  #   params[:rule]
  # )
  #  generation: `tree-sitter generate`,

  rules = find_rules("./grammar/#{params[:grammar]}")
  build_grammar("grammar.js", "grammar_#{params[:grammar]}", rules)

  `tree-sitter test`
end

# ...
post "/:grammar/:rule" do
  File.write(
    "./grammar/#{params[:grammar]}/#{params[:rule]}",
    params[:rule]
  )
end

rules = find_rules("./grammar/0x01")
build_grammar("grammar.js", "grammar_0x01", rules)
