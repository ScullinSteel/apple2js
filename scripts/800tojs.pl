#!/usr/bin/perl -w

use MIME::Base64 qw(encode_base64);
use Getopt::Std;

$Getopt::Std::STANDARD_HELP_VERSION = 1;

my %opts;
getopts('rn:c:t:', \%opts);

sub HELP_MESSAGE() {
    my $fh = shift;
    print $fh "dsk2js.pl [-c category] [-n name] [-t type] imagefile\n"
};
sub VERSION_MESSAGE() { my $fh = shift; print $fh "Version 1.0\n" };

open(DISK, $ARGV[0]) or die $!;
binmode(DISK);

my ($name, $ext) = $ARGV[0] =~ /([^\/]+)\.(dsk|po|2mg)$/i;
my $rv;
my $buffer;
my $readOnly = 0;
my $volume = 0;

my $category = "Misc";

$name = $opts{'n'} if ($opts{'n'});
$category = $opts{'c'} if ($opts{'c'});
$ext = $opts{'t'} if ($opts{'t'});
if ($opts{'r'}) {
    $readOnly = 1;
}

$ext = lc($ext);

my $tmp;
my $offset = 0;

if ($ext eq '2mg') {
    # Format
    $offset += read(DISK, $buffer, 0x04);
    $tmp = unpack("a[4]", $buffer);
    if ($tmp ne '2IMG') {
        print STDERR "Invalid format";
        exit(1);
    }

    # Creator
    $offset += read(DISK, $buffer, 0x04);
    $tmp = unpack("a[4]", $buffer);
    print STDERR "Creator: " . $tmp . "\n";

    # Header Length
    $offset += read(DISK, $buffer, 0x02);
    my $header_length = unpack("v", $buffer);

    # Version Number
    $offset += read(DISK, $buffer, 0x02);
    my $version_number = unpack("v", $buffer);
    if ($version_number != 1) {
        print STDERR "Unknown version: " . $version_number . "\n";
	      exit(1);
    }

    # Image Format
    $offset += read(DISK, $buffer, 0x04);
    my $image_format = unpack("V", $buffer);
    if ($image_format == 0) {
        $ext = "dsk";
    } elsif ($image_format == 1) {
        $ext = "po";
    } else {
        print STDERR "Handled image format: " . $image_format;
	      exit(1);
    }
    print STDERR "Format: " . $ext . "\n";

    # Flags
    $offset += read(DISK, $buffer, 0x04);
    my $flags = unpack("V", $buffer);
    if ($flags & 0x80000000) {
        $readOnly = 1;
    }
    if ($flags & 0x100) {
        $volume = $flags & 0xff;
    }

    $rv = read(DISK, $buffer, $header_length - $offset);
}

my $block = 0;
print "[\n";
for ($block = 0; $block < 1600; $block++) {
    print ",\n" if ($block != 0);
    $rv = read(DISK, $buffer, 0x200);
    print "    \"";
    print encode_base64($buffer, "");
    print "\"";
}
print "\n]";

close(DISK);
